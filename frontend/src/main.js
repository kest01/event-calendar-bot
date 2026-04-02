import './styles/main.css'
import { initCalendar } from './calendar/calendar.js'

const tg = window.Telegram.WebApp
tg.ready()
tg.expand()

console.log("tg.initDataUnsafe: ", tg.initDataUnsafe)
console.log("window.location.search: ", window.location.search)

// Получаем group_id из URL параметров
function getGroupIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('tgWebAppStartParam')
}

// Пользователь
const user = tg.initDataUnsafe?.user ?? null
const chat_id = tg.initDataUnsafe?.chat_instance || null

// const groupIdFromUrl = getGroupIdFromUrl()
// const groupId = groupIdFromUrl || chat_id || '3259485766946657054'
const groupId = getGroupIdFromUrl()

console.log('Group ID источники:', {
  // fromUrl: groupIdFromUrl,
  fromChatInstance: chat_id,
  selected: groupId
})

// TODO Только для отладки в браузере, удалить
const userContext = !user ?
{
  userId: 234436619,
  groupId: groupId,
  avatarUrl: 'https://t.me/i/userpic/320/TRhlIjhDlQ2pjoEa8PokGjZIn0fHz7FfGUMO63mTbyc.svg',
  user: {
    id: 234436619,
    first_name: 'Konstanti',
    last_name: 'Kharitonov',
    username: 'kest_ru'
  }
} : {
  userId: user?.id ?? null,
  groupId: groupId,
  avatarUrl: user?.photo_url ?? null,
  user: user
}

console.log(userContext)

// Загрузка информации о группе и инициализация календаря
async function initApp() {
  try {
    let groupInfo = null
    
    // Загружаем информацию о группе, если есть groupId
    if (userContext.groupId) {
      const response = await fetch(`/api/groups/${userContext.groupId}`)
      if (response.ok) {
        groupInfo = await response.json()
        console.log('Group info loaded:', groupInfo)
        
        // Обновляем приветствие с названием группы
        document.getElementById('title').innerText = groupInfo.title || 'Привет 👋'
      } else {
        console.warn('Group not found, using default greeting')
        addTitleForUser(userContext.groupId, user)
      }
    } else {
      // addTitleForUser(userContext.groupId, user)
      addTitleText('Запустите календарь по ссылке в группе')
      return
    }
    
    // Добавляем информацию о группе в контекст
    const extendedContext = {
      ...userContext,
      ...groupInfo
    }
    
    // Инициализируем календарь
    initCalendar(extendedContext)
  } catch (error) {
    console.error('Error initializing app:', error)
    // В случае ошибки все равно инициализируем календарь
    addTitleForUser(userContext.groupId, userContext.user)
    initCalendar(userContext)
  }
}

// Запуск приложения
initApp()

function isPersonalChar(chat_id) {
  return !chat_id || chat_id.startsWith('-');
}

function addTitleText(text) {
  document.getElementById('title').innerText = text
}

function addTitleForUser(groupId, user) {
  if (isPersonalChar(groupId)) {
    addTitleText(user ? `Личный календарь ${user.first_name} ${user.last_name}` : 'Привет 👋')
  } else {
    addTitleText('Календарь мероприятий')
  }
}
