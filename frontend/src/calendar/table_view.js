import { openEventDetails } from './event_details'
import { hideElement, showElement } from "../utils"

let currentEvents = []
let currentView = 'calendar' // 'calendar' или 'table'

export function initTableView() {
  const toggleLink = document.getElementById('toggle-view-link')
  const calendarView = document.getElementById('calendar')
  const tableView = document.getElementById('events-table-view')
  
  toggleLink.addEventListener('click', (e) => {
    e.preventDefault()
    
    if (currentView === 'calendar') {
      // Переключаемся на табличный вид
      console.log('Переключаемся на табличный вид')
      currentView = 'table'
      document.body.setAttribute('data-view', 'table')
      hideElement(calendarView)
      showElement(tableView)
      toggleLink.textContent = 'Календарь'
      renderEventsTable()
    } else {
      // Переключаемся на календарь
      console.log('Переключаемся на календарь')
      currentView = 'calendar'
      document.body.setAttribute('data-view', 'calendar')
      hideElement(tableView)
      showElement(calendarView)
      toggleLink.textContent = 'События списком'
    }
  })
}

// Сохранение событий для табличного вида
export function updateEventsCache(events) {
  currentEvents = events
  console.log('Loaded events', events)
}

// Отрисовка таблицы событий
async function renderEventsTable() {
  const tbody = document.getElementById('events-table-body')
  tbody.innerHTML = ''
  
  // Фильтруем только будущие события и сортируем по дате
  const now =new Date()
  const upcomingEvents = currentEvents
    .filter(event => {
        console.log('Date: ', new Date(event.date), now, event.date >= now)
        return new Date(event.date) >= now})
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    console.log('upcomingEvents', upcomingEvents)
  
  if (upcomingEvents.length === 0) {
    const row = document.createElement('tr')
    row.innerHTML = '<td colspan="3" class="no-events">Нет предстоящих событий</td>'
    tbody.appendChild(row)
    return
  }
  
  // Загружаем участников для всех событий
  const eventsWithParticipants = await Promise.all(
    upcomingEvents.map(async (event) => {
      const participants = await loadEventParticipants(event.id)
      return { ...event, participants }
    })
  )
  
  // Создаем строки таблицы
  eventsWithParticipants.forEach(event => {
    const row = createEventRow(event)
    tbody.appendChild(row)
  })
}

// Создание строки таблицы для события
function createEventRow(event) {
  const row = document.createElement('tr')
  
  // Колонка с датой
  const dateCell = document.createElement('td')
  dateCell.className = 'event-date'
  const eventDate = new Date(event.date)
  const dateStr = formatDate(eventDate)
  const timeStr = event.extendedProps?.time || ''
  dateCell.innerHTML = `
    <div>${dateStr}</div>
    ${timeStr ? `<div class="event-time">${timeStr}</div>` : ''}
  `
  
  // Колонка с названием события
  const titleCell = document.createElement('td')
  titleCell.className = 'event-title'
  titleCell.textContent = event.title
  
  // Колонка с участниками
  const participantsCell = document.createElement('td')
  const participantsDiv = document.createElement('div')
  participantsDiv.className = 'event-participants'
  
  // Объединяем всех участников (и maybe, и sure)
  const allParticipants = [
    ...(event.participants?.maybe || []),
    ...(event.participants?.sure || [])
  ]
  
  // Удаляем дубликаты по user_id
  const uniqueParticipants = allParticipants.filter((participant, index, self) =>
    index === self.findIndex(p => p.user_id === participant.user_id)
  )
  
  // Отрисовываем аватарки
  uniqueParticipants.forEach(participant => {
    const avatarDiv = createParticipantAvatar(participant)
    participantsDiv.appendChild(avatarDiv)
  })
  
  participantsCell.appendChild(participantsDiv)
  
  // Собираем строку
  row.appendChild(dateCell)
  row.appendChild(titleCell)
  row.appendChild(participantsCell)
  
  // Обработчик клика на строку - открываем модалку с деталями
  row.addEventListener('click', () => {
    openEventDetails(event)
  })
  
  return row
}

// Создание аватарки участника
function createParticipantAvatar(participant) {
  const avatarDiv = document.createElement('div')
  avatarDiv.className = 'participant-avatar'
  avatarDiv.title = `${participant.first_name} ${participant.last_name || ''}`.trim()
  
  if (participant.avatar_url) {
    const img = document.createElement('img')
    img.src = participant.avatar_url
    img.alt = participant.first_name
    avatarDiv.appendChild(img)
  } else {
    // Показываем инициалы, если нет аватара
    const initials = getInitials(participant.first_name, participant.last_name)
    avatarDiv.textContent = initials
  }
  
  return avatarDiv
}

// Получение инициалов из имени
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return first + last || '?'
}

// Форматирование даты
function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return date.toLocaleDateString('ru-RU', options)
}

// Загрузка участников события
async function loadEventParticipants(eventId) {
  try {
    const response = await fetch(`/api/events/${eventId}/participants`)
    if (!response.ok) {
      return { maybe: [], sure: [] }
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading participants:', error)
    return { maybe: [], sure: [] }
  }
}
