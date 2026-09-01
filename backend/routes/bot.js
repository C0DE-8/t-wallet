const { execute, query } = require('../db/sql')
const {
  deleteTelegramWebhook,
  getTelegramDebug,
  getTelegramWebhookInfo,
  handleTelegramUpdate,
  saveBotMessage,
  setTelegramWebhook,
} = require('../services/telegram')

async function handleBotRoute(request, response, url = new URL(request.url, `http://${request.headers.host}`)) {
  if (url.pathname === '/bot/debug') {
    await handleDebugRoute(request, response)
    return
  }

  if (url.pathname === '/bot/webhook/info') {
    await handleWebhookInfoRoute(request, response)
    return
  }

  if (url.pathname === '/bot/webhook/status') {
    await handleDebugRoute(request, response)
    return
  }

  if (url.pathname === '/bot/webhook' && request.method === 'GET') {
    await handleWebhookInfoRoute(request, response)
    return
  }

  if (url.pathname === '/bot/webhook' && request.method === 'POST' && isTelegramUpdate(request)) {
    await handleTelegramWebhook(request, response)
    return
  }

  if (url.pathname === '/bot/webhook' && request.method === 'POST') {
    await handleSetWebhookRoute(request, response)
    return
  }

  if (url.pathname === '/bot/webhook' && request.method === 'DELETE') {
    await handleDeleteWebhookRoute(request, response)
    return
  }

  if (url.pathname === '/bot') {
    await handleMessagesRoute(request, response)
    return
  }

  sendJson(response, 404, { ok: false, error: 'not found' })
}

async function handleDebugRoute(request, response) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { ok: false, error: 'method not allowed' })
    return
  }

  const telegram = await getTelegramDebug()
  sendJson(response, 200, { ok: true, status: 'ok', route: '/bot/webhook', telegram })
}

async function handleWebhookInfoRoute(request, response) {
  if (request.method !== 'GET') {
    sendJson(response, 405, { ok: false, error: 'method not allowed' })
    return
  }

  const webhook = await getTelegramWebhookInfo()
  sendJson(response, 200, { ok: true, webhook })
}

async function handleSetWebhookRoute(request, response) {
  let body = {}

  try {
    body = await readJsonBody(request)
  } catch (error) {
    sendJson(response, 400, { ok: false, error: 'invalid JSON body' })
    return
  }

  try {
    const result = await setTelegramWebhook(body.url)
    sendJson(response, 200, { ok: true, result })
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message })
  }
}

async function handleDeleteWebhookRoute(request, response) {
  const result = await deleteTelegramWebhook()
  sendJson(response, 200, { ok: true, result })
}

async function handleTelegramWebhook(request, response) {
  if (!isValidWebhookSecret(request)) {
    sendJson(response, 401, { ok: false, error: 'Invalid Telegram webhook secret' })
    return
  }

  let update

  try {
    update = await readJsonBody(request)
  } catch (error) {
    sendJson(response, 400, { ok: false, error: 'invalid JSON body' })
    return
  }

  await handleTelegramUpdate(update)
  sendJson(response, 200, { ok: true })
}

async function handleMessagesRoute(request, response) {
  if (request.method === 'GET') {
    const messages = await query(`
      SELECT id, source, chat_id, message, response, created_at
      FROM bot_messages
      ORDER BY id DESC
      LIMIT 20;
    `)

    sendJson(response, 200, {
      ok: true,
      status: 'ok',
      route: '/bot',
      botConfigured: Boolean(process.env.BOT_TOKEN),
      messages,
    })
    return
  }

  if (request.method === 'POST') {
    let body

    try {
      body = await readJsonBody(request)
    } catch (error) {
      sendJson(response, 400, { ok: false, error: 'invalid JSON body' })
      return
    }

    const message = String(body.message || '').trim()

    if (!message) {
      sendJson(response, 400, { ok: false, error: 'message is required' })
      return
    }

    const botResponse = `Received: ${message}`

    await execute(
      `
      INSERT INTO bot_messages (source, message, response)
      VALUES ('api', ?, ?);
    `,
      [message, botResponse],
    )

    sendJson(response, 201, {
      ok: true,
      message,
      response: botResponse,
    })
    return
  }

  sendJson(response, 405, { ok: false, error: 'method not allowed' })
}

function isTelegramUpdate(request) {
  return Boolean(request.headers['x-telegram-bot-api-secret-token'])
}

function isValidWebhookSecret(request) {
  const expectedSecret = process.env.BOT_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET

  if (!expectedSecret) {
    return true
  }

  return request.headers['x-telegram-bot-api-secret-token'] === expectedSecret
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
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  })
  response.end(JSON.stringify(payload))
}

module.exports = {
  handleBotRoute,
}
