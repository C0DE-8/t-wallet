const http = require('node:http')
const { loadEnv } = require('./config/env')

loadEnv()

const { runMigrations } = require('./db/migrate')
const { databaseConfig, query } = require('./db/sql')
const { handleBotRoute } = require('./routes/bot')

const port = Number(process.env.PORT || 3001)

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)

  try {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      })
      response.end()
      return
    }

    if (url.pathname === '/') {
      sendJson(response, 200, {
        status: 'ok',
        message: 'Hash Ripper backend is working',
      })
      return
    }

    if (url.pathname === '/health') {
      const migrations = await query('SELECT id, applied_at FROM schema_migrations ORDER BY id;')

      sendJson(response, 200, {
        status: 'ok',
        database: {
          host: databaseConfig.host,
          port: databaseConfig.port,
          name: databaseConfig.database,
        },
        migrations,
        botConfigured: Boolean(process.env.BOT_TOKEN),
      })
      return
    }

    if (url.pathname === '/bot' || url.pathname.startsWith('/bot/')) {
      await handleBotRoute(request, response, url)
      return
    }

    sendJson(response, 404, { error: 'not found' })
  } catch (error) {
    console.error(error)
    sendJson(response, 500, { error: 'internal server error' })
  }
})

runMigrations()
  .then(() => {
    server.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify(payload))
}
