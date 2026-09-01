const fs = require('node:fs')
const path = require('node:path')
const mysql = require('mysql2/promise')
const { closePool, databaseConfig, execute, executeStatements, query } = require('./sql')

const backendRoot = path.resolve(__dirname, '..')
const migrationsPath = path.resolve(backendRoot, 'migrations')

async function ensureDatabase() {
  const connection = await mysql.createConnection({
    host: databaseConfig.host,
    port: databaseConfig.port,
    user: databaseConfig.user,
    password: databaseConfig.password,
  })

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\`;`)
  } finally {
    await connection.end()
  }
}

async function runMigrations() {
  await ensureDatabase()

  await execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const migrationFiles = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.sql'))
    .sort()

  for (const file of migrationFiles) {
    const alreadyApplied = await query('SELECT 1 FROM schema_migrations WHERE id = ? LIMIT 1;', [file])

    if (alreadyApplied.length) {
      continue
    }

    const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8')

    await executeStatements(sql)
    await execute('INSERT INTO schema_migrations (id) VALUES (?);', [file])

    console.log(`Applied migration: ${file}`)
  }
}

if (require.main === module) {
  runMigrations()
    .then(closePool)
    .catch(async (error) => {
      console.error(error)
      await closePool()
      process.exit(1)
    })
}

module.exports = {
  runMigrations,
}
