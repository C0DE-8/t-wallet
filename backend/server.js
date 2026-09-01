const http = require('node:http')
const { loadEnv } = require('./config/env')

loadEnv()

const { runMigrations } = require('./db/migrate')
const { handleBotRoute } = require('./routes/bot')

const port = Number(process.env.PORT || 3001)

runMigrations()

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    })
    response.end()
    return
  }

  if (url.pathname === '/health') {
    sendJson(response, 200, { status: 'ok' })
    return
  }

  if (url.pathname === '/bot') {
    handleBotRoute(request, response)
    return
  }

  sendJson(response, 404, { error: 'not found' })
})

server.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  response.end(JSON.stringify(payload))
}
