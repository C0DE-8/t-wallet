const { execute, query } = require('../db/sql')

const botPin = process.env.BOT_PIN || '123456'

async function handleBotRoute(request, response, url = new URL(request.url, `http://${request.headers.host}`)) {
  if (url.pathname === '/bot/webhook') {
    await handleTelegramWebhook(request, response)
    return
  }

  if (url.pathname === '/bot/webhook/status') {
    sendJson(response, 200, {
      status: 'ok',
      route: '/bot/webhook',
      botConfigured: Boolean(process.env.BOT_TOKEN),
      webhookUrlConfigured: Boolean(process.env.BOT_WEBHOOK_URL),
      webhookSecretConfigured: Boolean(process.env.BOT_WEBHOOK_SECRET),
      pinConfigured: Boolean(botPin),
    })
    return
  }

  if (request.method === 'GET') {
    const messages = await query(`
      SELECT id, source, chat_id, message, response, created_at
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
      INSERT INTO bot_messages (source, message, response)
      VALUES ('api', ?, ?);
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

async function handleTelegramWebhook(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'method not allowed' })
    return
  }

  if (!isValidWebhookSecret(request)) {
    sendJson(response, 401, { error: 'invalid webhook secret' })
    return
  }

  let update

  try {
    update = await readJsonBody(request)
  } catch (error) {
    sendJson(response, 400, { error: 'invalid JSON body' })
    return
  }

  const telegramMessage = update.message || update.edited_message
  const chatId = telegramMessage?.chat?.id
  const messageId = telegramMessage?.message_id || null
  const text = String(telegramMessage?.text || '').trim()

  if (!chatId || !text) {
    sendJson(response, 200, { ok: true, ignored: true })
    return
  }

  const chatIdText = String(chatId)
  const botResponse = await createTelegramBotResponse(chatIdText, text)

  await execute(
    `
    INSERT IGNORE INTO bot_messages (
      source,
      chat_id,
      telegram_message_id,
      telegram_update_id,
      message,
      response
    )
    VALUES ('telegram', ?, ?, ?, ?, ?);
  `,
    [chatIdText, messageId, update.update_id || null, text, botResponse],
  )

  const delivered = await sendTelegramMessage(chatIdText, botResponse)

  sendJson(response, 200, {
    ok: true,
    response: botResponse,
    delivered,
  })
}

function createBotResponse(message) {
  return `Received: ${message}`
}

async function createTelegramBotResponse(chatId, message) {
  const normalizedMessage = message.trim().toLowerCase()

  if (normalizedMessage === '/start') {
    return 'Enter PIN to start using the bot.'
  }

  if (normalizedMessage === '/logout') {
    await execute('DELETE FROM bot_authorized_chats WHERE chat_id = ?;', [chatId])
    return 'Bot locked. Send /start and enter the PIN to use it again.'
  }

  if (await isAuthorizedChat(chatId)) {
    if (normalizedMessage === '/help') {
      return 'Send a message and I will confirm that the webhook received it. Send /logout to lock the bot.'
    }

    return createBotResponse(message)
  }

  if (message === botPin) {
    await authorizeChat(chatId)
    return 'PIN accepted. Bot is ready.'
  }

  return 'Bot is locked. Send /start, then enter the PIN.'
}

async function isAuthorizedChat(chatId) {
  const rows = await query('SELECT 1 FROM bot_authorized_chats WHERE chat_id = ? LIMIT 1;', [chatId])
  return rows.length > 0
}

async function authorizeChat(chatId) {
  await execute(
    `
    INSERT INTO bot_authorized_chats (chat_id)
    VALUES (?)
    ON DUPLICATE KEY UPDATE authorized_at = CURRENT_TIMESTAMP;
  `,
    [chatId],
  )
}

function isValidWebhookSecret(request) {
  const expectedSecret = process.env.BOT_WEBHOOK_SECRET

  if (!expectedSecret) {
    return true
  }

  return request.headers['x-telegram-bot-api-secret-token'] === expectedSecret
}

async function sendTelegramMessage(chatId, text) {
  if (!process.env.BOT_TOKEN) {
    return false
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  })

  return telegramResponse.ok
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
