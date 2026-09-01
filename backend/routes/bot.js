const { execute, query } = require('../db/sql')

async function handleBotRoute(request, response) {
  if (request.method === 'GET') {
    const messages = await query(`
      SELECT id, message, response, created_at
      FROM bot_messages
      ORDER BY id DESC
      LIMIT 20;
    `)

    sendJson(response, 200, {
      status: 'ok',
      route: '/bot',
      botConfigured: Boolean(process.env.BOT_TOKEN),
      message: 'Bot route is ready.',
      messages,
    })
    return
  }

  if (request.method === 'POST') {
    let body

    try {
      body = await readJsonBody(request)
    } catch (error) {
      sendJson(response, 400, { error: 'invalid JSON body' })
      return
    }

    const message = String(body.message || '').trim()

    if (!message) {
      sendJson(response, 400, { error: 'message is required' })
      return
    }

    const botResponse = createBotResponse(message)

    await execute(
      `
      INSERT INTO bot_messages (message, response)
      VALUES (?, ?);
    `,
      [message, botResponse],
    )

    sendJson(response, 201, {
      message,
      response: botResponse,
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

module.exports = {
  handleBotRoute,
}
