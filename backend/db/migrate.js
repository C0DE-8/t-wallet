const fs = require('node:fs')
const path = require('node:path')
const { databasePath, escapeSql, execute, executeFile, initializeDatabaseDirectory } = require('./sqlite')

const backendRoot = path.resolve(__dirname, '..')
const migrationsPath = path.resolve(backendRoot, 'migrations')

function runMigrations() {
  initializeDatabaseDirectory()

  execute(`
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
    const alreadyApplied = execute(
      `SELECT 1 FROM schema_migrations WHERE id = '${escapeSql(file)}' LIMIT 1;`,
    ).trim()

    if (alreadyApplied) {
      continue
    }

    const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8')

    executeFile(`
      BEGIN;
      ${sql}
      INSERT INTO schema_migrations (id) VALUES ('${escapeSql(file)}');
      COMMIT;
    `)

    console.log(`Applied migration: ${file}`)
  }
}

if (require.main === module) {
  runMigrations()
}

module.exports = {
  databasePath,
  execSql: execute,
  runMigrations,
}
