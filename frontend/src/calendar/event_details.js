import { hideElement, showElement } from "../utils"
import { editEvent } from "./add_event"

const eventDetailsModel = document.getElementById('event-details-modal')
const detailsImg = document.getElementById('details-photo')
const maybeBtn = document.getElementById('maybe-btn')
const sureBtn = document.getElementById('sure-btn')
const maybeParticipantsSection = document.getElementById('maybe-participants-section')
const sureParticipantsSection = document.getElementById('sure-participants-section')
const maybeParticipantsAvatars = document.getElementById('maybe-participants-avatars')
const sureParticipantsAvatars = document.getElementById('sure-participants-avatars')

let currentEvent
let userContext = null
let currentUserParticipation = null

export function initEventDetailsModal(context) {
    userContext = context
    
    const overlay = eventDetailsModel.querySelector('.modal-overlay')
    overlay.addEventListener('click', closeEventDetails)

    document.querySelector('.event-details-edit-btn')
        .addEventListener('click', (e) => {
            closeEventDetails()
            editEvent(currentEvent)
        })
    
    // Обработчики кнопок участия
    maybeBtn.addEventListener('click', () => handleParticipationClick('maybe'))
    sureBtn.addEventListener('click', () => handleParticipationClick('sure'))
}

export async function openEventDetails(event) {
  currentEvent = event
  document.getElementById('details-title').textContent = event.title

  document.getElementById('details-description').textContent = event.extendedProps.description

  document.getElementById('details-date').textContent = event.extendedProps.date
  document.getElementById('details-time').textContent = event.extendedProps.time

  document.getElementById('details-edit-btn').hidden = !isEventEditAllowed(currentEvent)

  if (event.extendedProps.place) {
   document.getElementById('details-place').textContent = event.extendedProps.place
   showElement(document.getElementById('details-place-block'))
  } else {
   hideElement(document.getElementById('details-place-block'))
  }
  if (event.extendedProps.photo) {
    detailsImg.src = event.extendedProps.photo
    detailsImg.hidden = false
  } else {
    detailsImg.hidden = true
  }

  // Загружаем участников и статус текущего пользователя
  await loadParticipants(event.id)
  
  updateParticipationButtons()

  showElement(eventDetailsModel, 'flex')
}

export function closeEventDetails() {
    hideElement(eventDetailsModel)
    currentUserParticipation = null
}

// Загрузка всех участников события
async function loadParticipants(eventId) {
  try {
    currentUserParticipation = null
    const response = await fetch(`/api/events/${eventId}/participants`)
    if (!response.ok) {
      throw new Error('Failed to load participants')
    }
    
    const participants = await response.json()
    // console.log("participants: " + JSON.stringify(participants))

    // Отображаем участников "Возможно участвую"
    if (participants.maybe && participants.maybe.length > 0) {
      renderParticipants(participants.maybe, maybeParticipantsAvatars)
      if (participants.maybe.some(item => item.user_id == userContext.userId)) {
        currentUserParticipation = 'maybe'
      }
      showElement(maybeParticipantsSection)
    } else {
      hideElement(maybeParticipantsSection)
    }
    
    // Отображаем участников "Точно участвую!"
    if (participants.sure && participants.sure.length > 0) {
      renderParticipants(participants.sure, sureParticipantsAvatars)
      if (participants.sure.some(item => item.user_id == userContext.userId)) {
        currentUserParticipation = 'sure'
      }
      showElement(sureParticipantsSection)
    } else {
      hideElement(sureParticipantsSection)
    }
    console.log("currentUserParticipation: " + currentUserParticipation)
  } catch (error) {
    console.error('Error loading participants:', error)
  }
}

// Отрисовка аватаров участников
function renderParticipants(participants, container) {
  container.innerHTML = ''
  
  participants.forEach(participant => {
    const avatarDiv = document.createElement('div')
    avatarDiv.className = 'participant-avatar'
    avatarDiv.title = `${participant.first_name} ${participant.last_name || ''}`.trim()
    
    // Добавляем обработчик клика для открытия профиля в Telegram
    if (participant.user_id) {
      avatarDiv.style.cursor = 'pointer'
      avatarDiv.addEventListener('click', () => {
        console.log('Open user profile ', participant.username)
        if (participant.username) {
          window.open(`tg://resolve?domain=${participant.username}`, '_blank')
        }
      })
    }
    
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
    
    container.appendChild(avatarDiv)
  })
}

// Получение инициалов из имени
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return first + last || '?'
}

// Обновление состояния кнопок участия
function updateParticipationButtons() {
  // Сбрасываем состояние кнопок
  maybeBtn.classList.remove('selected')
  sureBtn.classList.remove('selected')
  
  // Устанавливаем активную кнопку и отключаем другую
  if (currentUserParticipation === 'maybe') {
    maybeBtn.classList.add('selected')
  } else if (currentUserParticipation === 'sure') {
    sureBtn.classList.add('selected')
  }
}

// Обработка клика по кнопке участия
async function handleParticipationClick(participationType) {
  if (!userContext?.userId) {
    console.error('User context not available')
    return
  }
  
  const eventId = currentEvent.id
  
  try {
    // Удаление пользователя из списка
    let response
    if (currentUserParticipation == participationType) {
      response = await fetch(`/api/events/${eventId}/participants/${userContext.userId}`, {
        method: 'DELETE',
      })
    } else { // Добавление пользователя в список
      response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: userContext.userId,
          first_name: userContext.user?.first_name || 'User',
          last_name: userContext.user?.last_name || '',
          username: userContext.user?.username || '',
          avatar_url: userContext.avatarUrl || null,
          participation_type: participationType
        })
      })
    }
    
    if (!response.ok) {
      throw new Error('Failed to update participation')
    }
        
    // Перезагружаем список участников
    await loadParticipants(eventId)
    updateParticipationButtons()
    
  } catch (error) {
    console.error('Error updating participation:', error)
    alert('Не удалось обновить статус участия')
  }
}

function isEventEditAllowed(event) {
  console.log("Event: ", event.extendedProps)
  console.log("userContext: ", userContext)
  console.log("result: ", (event.extendedProps.ownerId == userContext.userId))
  return (event.extendedProps.ownerId == userContext.userId) 
  || (userContext.admins && userContext.admins.includes(userContext.userId))
}
