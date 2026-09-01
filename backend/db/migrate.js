const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const { loadEnv } = require('../config/env')

loadEnv()

const backendRoot = path.resolve(__dirname, '..')
const databasePath = path.resolve(backendRoot, process.env.DATABASE_PATH || './data/app.sqlite')
const migrationsPath = path.resolve(backendRoot, 'migrations')

function runMigrations() {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })

  execSql(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const migrationFiles = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.sql'))
    .sort()

  for (const file of migrationFiles) {
    const alreadyApplied = execSql(
      `SELECT 1 FROM schema_migrations WHERE id = '${escapeSql(file)}' LIMIT 1;`,
    ).trim()

    if (alreadyApplied) {
      continue
    }

    const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8')

    execSql(`
      BEGIN;
      ${sql}
      INSERT INTO schema_migrations (id) VALUES ('${escapeSql(file)}');
      COMMIT;
    `)

    console.log(`Applied migration: ${file}`)
  }
}

function execSql(sql) {
  return execFileSync('sqlite3', [databasePath, sql], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function escapeSql(value) {
  return value.replaceAll("'", "''")
}

if (require.main === module) {
  runMigrations()
}

module.exports = {
  databasePath,
  execSql,
  runMigrations,
}
