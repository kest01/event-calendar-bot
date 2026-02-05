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

  const mouseEvent = info.jsEvent
  popover.hidden = false
  popover.style.top = `${mouseEvent.clientY + 8}px`
  popover.style.left = `${mouseEvent.clientX + 8}px`
}

export function initAddEventModal(calendar) {
  document.addEventListener('click', e => {
    if (!popover.contains(e.target)) {
      popover.hidden = true
    }
  })

  document.getElementById('add-event-btn').addEventListener('click', () => {
    console.log('add-event-btn')
    popover.hidden = true

    dateInput.value = selectedDate
    idInput.value = ''
    titleInput.value = ''
    descInput.value = ''
    timeInput.value = ''
    placeInput.value = ''
    photoInput.value = ''

    modal.hidden = false
    modal.style.display = 'block'
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

      modal.hidden = true
      modal.style.display = 'none'

      calendar.refetchEvents()
    } catch (e) {
      console.error('Save event error: ' + e)
      alert('Ошибка сохранения')
    }
  }

  document.getElementById('cancel-btn').onclick = async () => {
    modal.hidden = true
    modal.style.display = 'none'
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

function isValidTime(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
}