const mysql = require('mysql2/promise')
const { loadEnv } = require('../config/env')

loadEnv()

const databaseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trust_wallet',
  multipleStatements: true,
}

let pool

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...databaseConfig,
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    })
  }

  return pool
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params)
  return rows
}

async function execute(sql, params = []) {
  const [result] = await getPool().execute(sql, params)
  return result
}

async function executeStatements(sql) {
  const [result] = await getPool().query(sql)
  return result
}

async function closePool() {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}

module.exports = {
  closePool,
  databaseConfig,
  execute,
  executeStatements,
  query,
}
