import './styles/main.css'
import { initCalendar } from './calendar/calendar.js'

const tg = window.Telegram.WebApp
tg.ready()
tg.expand()

console.log(tg.initDataUnsafe)

// Пользователь
const user = tg.initDataUnsafe?.user ?? null
let chat_id = tg.initDataUnsafe?.chat_instance
if (!chat_id || chat_id.startsWith('-')) {
  chat_id = user?.id || null
}

// TODO Переделать приветствие в зависимости от настроек канала
document.getElementById('user').innerText = user ? `Привет, ${user.first_name}` : 'Привет 👋'
// Календарь
const userContext = {
  userId: user?.id ?? null,
  groupId: chat_id,
  avatarUrl: user?.photo_url ?? null,
  user: user
}

console.log(userContext)
initCalendar(userContext)