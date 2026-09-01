const { loadEnv } = require('../config/env')

loadEnv()

async function setupTelegramWebhook() {
  const botToken = process.env.BOT_TOKEN
  const webhookUrl = process.env.BOT_WEBHOOK_URL
  const webhookSecret = process.env.BOT_WEBHOOK_SECRET

  if (!botToken) {
    throw new Error('BOT_TOKEN is required')
  }

  if (!webhookUrl) {
    throw new Error('BOT_WEBHOOK_URL is required')
  }

  const payload = {
    url: webhookUrl,
    allowed_updates: ['message', 'edited_message'],
  }

  if (webhookSecret) {
    payload.secret_token = webhookSecret
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const body = await response.json()

  if (!response.ok || !body.ok) {
    throw new Error(body.description || 'Telegram setWebhook failed')
  }

  console.log('Telegram webhook configured')
  console.log(`Webhook URL: ${webhookUrl}`)
}

setupTelegramWebhook().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
