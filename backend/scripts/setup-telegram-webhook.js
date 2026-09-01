const { loadEnv } = require('../config/env')
const { setTelegramWebhook } = require('../services/telegram')

loadEnv()

setTelegramWebhook()
  .then(() => {
    console.log('Telegram webhook configured')
    console.log(`Webhook URL: ${process.env.BOT_WEBHOOK_URL}`)
  })
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
