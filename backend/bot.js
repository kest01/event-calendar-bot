import TelegramBot from 'node-telegram-bot-api'
import 'dotenv/config'

if (process.env.BOT_ENABLED) {
  const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

  bot.onText(/\/start/, msg => {
    console.log("Request:" + JSON.stringify(msg))
    let responseMsg = {
      reply_markup: {
        keyboard: [[{ text: 'Открыть', web_app: { url: process.env.APP_URL } }]],
        resize_keyboard: true
      }
    }
    bot.sendMessage(msg.chat.id, 'Чтобы открыть расписание мероприятий нажмите кнопку ниже', responseMsg)
    console.log("Response:" + JSON.stringify(responseMsg))
  })

  console.log('Telegram Bot started')
}
