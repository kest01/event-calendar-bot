import TelegramBot from 'node-telegram-bot-api'
import 'dotenv/config'

if (process.env.BOT_ENABLED) {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

  bot.onText(/\/start/, msg => {
    console.log(msg)
    bot.sendMessage(msg.chat.id, 'Открыть Mini App', {
      reply_markup: {
        keyboard: [[{ text: 'Открыть', web_app: { url: process.env.APP_URL } }]],
        resize_keyboard: true
      }
    })
  })

  console.log('Telegram Bot started')
}
