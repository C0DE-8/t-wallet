const { execSql } = require('../db/migrate')

function handleBotRoute(request, response) {
  if (request.method === 'GET') {
    sendJson(response, 200, {
      status: 'ok',
      route: '/bot',
      botConfigured: Boolean(process.env.BOT_TOKEN),
      message: 'Bot route is ready.',
    })
    return
  }

  if (request.method === 'POST') {
    readJsonBody(request)
      .then((body) => {
        const message = String(body.message || '').trim()

        if (!message) {
          sendJson(response, 400, { error: 'message is required' })
          return
        }

        const botResponse = createBotResponse(message)

        execSql(`
          INSERT INTO bot_messages (message, response)
          VALUES ('${escapeSql(message)}', '${escapeSql(botResponse)}');
        `)

        sendJson(response, 201, {
          message,
          response: botResponse,
        })
      })
      .catch(() => {
        sendJson(response, 400, { error: 'invalid JSON body' })
      })
    return
  }

  sendJson(response, 405, { error: 'method not allowed' })
}

function createBotResponse(message) {
  return `Received: ${message}`
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk

      if (body.length > 100_000) {
        request.destroy()
        reject(new Error('body too large'))
      }
    })

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  })
  response.end(JSON.stringify(payload))
}

function escapeSql(value) {
  return value.replaceAll("'", "''")
}

module.exports = {
  handleBotRoute,
}
