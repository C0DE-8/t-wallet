const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { loadEnv } = require('../config/env')

loadEnv()

const backendRoot = path.resolve(__dirname, '..')
const databasePath = path.resolve(backendRoot, process.env.DATABASE_PATH || './data/app.sqlite')

function initializeDatabaseDirectory() {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })
}

function execute(sql) {
  initializeDatabaseDirectory()

  return execFileSync('sqlite3', [databasePath, sql], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function executeFile(sql) {
  initializeDatabaseDirectory()

  const sqlPath = path.join(os.tmpdir(), `t-wallet-${Date.now()}-${Math.random()}.sql`)

  try {
    fs.writeFileSync(sqlPath, sql)

    return execFileSync('sqlite3', [databasePath, `.read ${sqlPath}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  } finally {
    fs.rmSync(sqlPath, { force: true })
  }
}

function queryJson(sql) {
  initializeDatabaseDirectory()

  const output = execFileSync('sqlite3', ['-json', databasePath, sql], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()

  return output ? JSON.parse(output) : []
}

function escapeSql(value) {
  return String(value).replaceAll("'", "''")
}

module.exports = {
  databasePath,
  escapeSql,
  execute,
  executeFile,
  initializeDatabaseDirectory,
  queryJson,
}
