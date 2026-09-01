const { execute, query } = require('../db/sql')

const DEFAULT_ACCESS_PASSWORD = '123456'
const MENU_BUTTONS = {
  menu: 'Menu',
  access: 'Check access',
  stats: 'Bot stats',
  messages: 'Recent messages',
  lock: 'Lock bot',
  help: 'Help',
}

function getBotToken() {
  return process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN
}

function getWebhookUrl() {
  return process.env.BOT_WEBHOOK_URL || process.env.TELEGRAM_WEBHOOK_URL
}

function getWebhookSecret() {
  return process.env.BOT_WEBHOOK_SECRET || process.env.TELEGRAM_WEBHOOK_SECRET
}

function getAccessPassword() {
  return process.env.BOT_PIN || process.env.TELEGRAM_ACCESS_PASSWORD || DEFAULT_ACCESS_PASSWORD
}

function getTelegramTimeout() {
  return Number(process.env.TELEGRAM_TIMEOUT_MS || 10000)
}

function getManagerKeyboard() {
  return {
    keyboard: [
      [{ text: MENU_BUTTONS.menu }, { text: MENU_BUTTONS.access }],
      [{ text: MENU_BUTTONS.messages }, { text: MENU_BUTTONS.stats }],
      [{ text: MENU_BUTTONS.lock }, { text: MENU_BUTTONS.help }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
    input_field_placeholder: 'Choose a bot action',
  }
}

function getMenuText(isAuthorized) {
  if (!isAuthorized) {
    return [
      'Welcome to the manager bot.',
      'Send the access PIN to unlock bot actions.',
      '',
      'PIN: 123456',
    ].join('\n')
  }

  return [
    'Manager menu',
    '',
    'Check access - confirm this chat is approved',
    'Bot stats - show approved chats and saved messages',
    'Recent messages - show the latest bot messages',
    'Lock bot - remove access for this chat',
    'Help - show these instructions',
    '',
    'Send a normal message and the bot will confirm it was received.',
  ].join('\n')
}

async function telegramRequest(method, payload = {}) {
  const token = getBotToken()

  if (!token) {
    throw new Error('Telegram bot token is not configured')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), getTelegramTimeout())

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const body = await response.json()

    if (!response.ok || body.ok !== true) {
      throw new Error(body.description || 'Telegram request failed')
    }

    return body.result
  } finally {
    clearTimeout(timeout)
  }
}

async function sendTelegramMessage(chatId, text, options = {}) {
  return telegramRequest('sendMessage', {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    ...options,
  })
}

async function saveAuthorizedChat(chat) {
  await execute(
    `
    INSERT INTO bot_authorized_chats (
      chat_id,
      chat_type,
      username,
      first_name,
      last_name
    )
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      chat_type = VALUES(chat_type),
      username = VALUES(username),
      first_name = VALUES(first_name),
      last_name = VALUES(last_name),
      last_seen_at = CURRENT_TIMESTAMP;
  `,
    [
      String(chat.id),
      chat.type || '',
      chat.username || '',
      chat.first_name || '',
      chat.last_name || '',
    ],
  )
}

async function isAuthorizedChat(chatId) {
  const rows = await query('SELECT chat_id FROM bot_authorized_chats WHERE chat_id = ? LIMIT 1;', [String(chatId)])
  return rows.length > 0
}

async function removeAuthorizedChat(chatId) {
  await execute('DELETE FROM bot_authorized_chats WHERE chat_id = ?;', [String(chatId)])
}

async function getAuthorizedChatCount() {
  const rows = await query('SELECT COUNT(*) AS count FROM bot_authorized_chats;')
  return Number(rows[0]?.count || 0)
}

async function getMessageCount() {
  const rows = await query('SELECT COUNT(*) AS count FROM bot_messages;')
  return Number(rows[0]?.count || 0)
}

async function getRecentMessages(limit = 10) {
  return query(
    `
    SELECT source, chat_id, message, response, created_at
    FROM bot_messages
    ORDER BY id DESC
    LIMIT ?;
  `,
    [limit],
  )
}

async function saveBotMessage({ source, chatId, telegramMessageId, telegramUpdateId, message, response }) {
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
    VALUES (?, ?, ?, ?, ?, ?);
  `,
    [
      source || 'telegram',
      chatId ? String(chatId) : null,
      telegramMessageId || null,
      telegramUpdateId || null,
      message,
      response,
    ],
  )
}

async function sendManagerMenu(chatId, isAuthorized) {
  await sendTelegramMessage(chatId, getMenuText(isAuthorized), {
    reply_markup: getManagerKeyboard(),
  })
}

async function sendManagerStats(chatId) {
  const [authorizedChatCount, messageCount] = await Promise.all([
    getAuthorizedChatCount(),
    getMessageCount(),
  ])

  await sendTelegramMessage(
    chatId,
    [
      'Bot stats',
      '',
      `Approved chats: ${authorizedChatCount}`,
      `Saved messages: ${messageCount}`,
      `Webhook URL configured: ${getWebhookUrl() ? 'yes' : 'no'}`,
      `Webhook secret configured: ${getWebhookSecret() ? 'yes' : 'no'}`,
    ].join('\n'),
    { reply_markup: getManagerKeyboard() },
  )
}

async function sendRecentBotMessages(chatId) {
  const messages = await getRecentMessages(10)

  if (!messages.length) {
    await sendTelegramMessage(chatId, 'No bot messages found.', {
      reply_markup: getManagerKeyboard(),
    })
    return
  }

  await sendTelegramMessage(chatId, `Recent messages: ${messages.length}`, {
    reply_markup: getManagerKeyboard(),
  })

  for (const message of messages) {
    await sendTelegramMessage(
      chatId,
      [
        `Source: ${message.source}`,
        message.chat_id ? `Chat: ${message.chat_id}` : null,
        `Message: ${message.message}`,
        `Response: ${message.response}`,
        `Created: ${message.created_at}`,
      ].filter(Boolean).join('\n'),
    )
  }
}

async function handleTelegramUpdate(update) {
  const message = update.message || update.edited_message

  if (!message || !message.chat) {
    return
  }

  const chat = message.chat
  const chatId = String(chat.id)
  const text = typeof message.text === 'string' ? message.text.trim() : ''

  if (!text || text === '/start' || text === '/menu' || text === MENU_BUTTONS.menu) {
    await sendManagerMenu(chatId, await isAuthorizedChat(chatId))
    await saveBotMessage({
      chatId,
      telegramMessageId: message.message_id,
      telegramUpdateId: update.update_id,
      message: text || '[non-text message]',
      response: 'menu',
    })
    return
  }

  const authorized = await isAuthorizedChat(chatId)

  if (text === getAccessPassword()) {
    await saveAuthorizedChat(chat)
    await sendTelegramMessage(chatId, 'Access approved. Bot is ready.', {
      reply_markup: getManagerKeyboard(),
    })
    await sendManagerMenu(chatId, true)
    await saveBotMessage({
      chatId,
      telegramMessageId: message.message_id,
      telegramUpdateId: update.update_id,
      message: text,
      response: 'access approved',
    })
    return
  }

  if (text === MENU_BUTTONS.access || text === '/access') {
    const response = authorized
      ? 'This chat is approved.'
      : 'This chat is not approved yet. Send the access PIN.'

    await sendTelegramMessage(chatId, response, { reply_markup: getManagerKeyboard() })
    await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response })
    return
  }

  if (!authorized) {
    const response = 'Invalid PIN. Send the access PIN or tap Menu.'
    await sendTelegramMessage(chatId, response, { reply_markup: getManagerKeyboard() })
    await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response })
    return
  }

  if (text === MENU_BUTTONS.help || text === '/help') {
    await sendManagerMenu(chatId, true)
    await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response: 'help' })
    return
  }

  if (text === MENU_BUTTONS.stats || text === '/stats') {
    await sendManagerStats(chatId)
    await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response: 'stats' })
    return
  }

  if (text === MENU_BUTTONS.messages || text === '/messages') {
    await sendRecentBotMessages(chatId)
    await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response: 'recent messages' })
    return
  }

  if (text === MENU_BUTTONS.lock || text === '/logout') {
    await removeAuthorizedChat(chatId)
    const response = 'Bot locked. Send /start and enter the PIN to use it again.'
    await sendTelegramMessage(chatId, response, { reply_markup: getManagerKeyboard() })
    await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response })
    return
  }

  const response = `Received: ${text}`
  await sendTelegramMessage(chatId, response, { reply_markup: getManagerKeyboard() })
  await saveBotMessage({ chatId, telegramMessageId: message.message_id, telegramUpdateId: update.update_id, message: text, response })
}

async function setTelegramWebhook(url = getWebhookUrl()) {
  if (!url) {
    throw new Error('Webhook URL is required')
  }

  const payload = {
    url,
    allowed_updates: ['message', 'edited_message'],
  }

  if (getWebhookSecret()) {
    payload.secret_token = getWebhookSecret()
  }

  return telegramRequest('setWebhook', payload)
}

async function deleteTelegramWebhook() {
  return telegramRequest('deleteWebhook', {
    drop_pending_updates: process.env.TELEGRAM_DROP_PENDING_UPDATES === 'true',
  })
}

async function getTelegramWebhookInfo() {
  return telegramRequest('getWebhookInfo')
}

async function getTelegramDebug() {
  let webhook = null
  let webhookError = null

  try {
    webhook = getBotToken() ? await getTelegramWebhookInfo() : null
  } catch (error) {
    webhookError = error.message
  }

  return {
    tokenConfigured: Boolean(getBotToken()),
    tokenLength: getBotToken() ? getBotToken().length : 0,
    passwordConfigured: Boolean(getAccessPassword()),
    webhookUrlConfigured: Boolean(getWebhookUrl()),
    webhookSecretConfigured: Boolean(getWebhookSecret()),
    authorizedChatCount: await getAuthorizedChatCount(),
    webhook,
    webhookError,
  }
}

module.exports = {
  deleteTelegramWebhook,
  getManagerKeyboard,
  getTelegramDebug,
  getTelegramWebhookInfo,
  handleTelegramUpdate,
  saveBotMessage,
  sendTelegramMessage,
  setTelegramWebhook,
}
