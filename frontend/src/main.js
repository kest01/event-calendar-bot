import './styles/main.css'
import { initCalendar } from './calendar/calendar.js'

const tg = window.Telegram.WebApp
tg.ready()
tg.expand()

// Пользователь
const user = tg.initDataUnsafe?.user
document.getElementById('user').innerText =
  user ? `Привет, ${user.first_name}` : 'Привет 👋'

// Календарь
initCalendar()