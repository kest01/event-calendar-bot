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
// TODO Только для отладки в браузере, удалить
const userContext = !user ?
{
  userId: 222,
  groupId: '3259485766946657054',
  avatarUrl: 'https://t.me/i/userpic/320/TRhlIjhDlQ2pjoEa8PokGjZIn0fHz7FfGUMO63mTbyc.svg',
  user: {
    id: 222,
    first_name: "Konstantin",
    last_name: "Kharitonov"
  }
} : {
  userId: user?.id ?? null,
  groupId: chat_id,
  avatarUrl: user?.photo_url ?? null,
  user: user
}

console.log(userContext)
// Календарь
initCalendar(userContext)