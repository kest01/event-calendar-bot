import { getEventCoordinates, hideElement, showElement } from "../utils"

const popover = document.getElementById('add-event-popover')
const modal = document.getElementById('event-modal')
const idInput = document.getElementById('event-id')
const titleInput = document.getElementById('event-title')
const descInput = document.getElementById('event-description')
const dateInput = document.getElementById('event-date')
const timeInput = document.getElementById('event-time')
const placeInput = document.getElementById('event-place')
const photoInput = document.getElementById('event-photo')

var selectedDate

export function showAddEventPopover(info) {
  selectedDate = info.dateStr

  const coord = getEventCoordinates(info.jsEvent)
  popover.hidden = false
  popover.style.top = `${coord.clientY + 8}px`
  popover.style.left = `${coord.clientX + 8}px`

  console.log(coord)
}

export function initAddEventModal(calendar) {
  document.addEventListener('click', e => {
    if (!popover.contains(e.target)) {
      popover.hidden = true
    }
  })

  const overlay = modal.querySelector('.modal-overlay')
  overlay.addEventListener('click', closeAddEventModal)
  

  document.getElementById('add-event-btn').addEventListener('click', () => {
    popover.hidden = true

    dateInput.value = selectedDate
    idInput.value = ''
    titleInput.value = ''
    descInput.value = ''
    timeInput.value = ''
    placeInput.value = ''
    photoInput.value = ''

    showElement(modal, 'flex')
  })

  document.getElementById('save-btn').onclick = async () => {
    
    const payload = {
      id: idInput.value,
      title: titleInput.value,
      description: descInput.value,
      place: placeInput.value,
      photo: photoInput.value,
    }

    if (!payload.title) {
      alert('Введите название')
      return
    }

    const time = timeInput.value

    if (time && !isValidTime(time)) {
      alert('Введите время в формате 19:30')
      return
    }

    payload.start_time = `${dateInput.value}T${(time || '00:00')}:00`

    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      hideElement(modal)
      calendar.refetchEvents()
    } catch (e) {
      console.error('Save event error: ' + e)
      alert('Ошибка сохранения')
    }
  }

  document.getElementById('cancel-btn').onclick = async () => {
    closeAddEventModal()
  }

  timeInput.addEventListener('input', () => {
    let value = timeInput.value.replace(/\D/g, '').slice(0, 4)

    if (value.length >= 3) {
      value = value.slice(0, 2) + ':' + value.slice(2)
    }

    timeInput.value = value
  })

  timeInput.addEventListener('focus', () => {
    if (!timeInput.value) {
      timeInput.setSelectionRange(0, 0)
    }
  })
}

export function closeAddEventModal() {
  hideElement(modal)
}

export function editEvent(event) {
  dateInput.value = event.extendedProps.date
  idInput.value = event.id
  titleInput.value = event.title
  descInput.value = event.extendedProps.description
  timeInput.value = event.extendedProps.time
  placeInput.value = event.extendedProps.place
  photoInput.value = event.extendedProps.photo

  showElement(modal, 'flex')
}

function isValidTime(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
}