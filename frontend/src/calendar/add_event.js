
const popover = document.getElementById('add-event-popover')
const modal = document.getElementById('event-modal')
const titleInput = document.getElementById('event-title')
const descInput = document.getElementById('event-description')
const dateInput = document.getElementById('event-date')

var selectedDate

export function showAddEventPopover(info) {
  selectedDate = info.dateStr

  const mouseEvent = info.jsEvent
  popover.hidden = false
  popover.style.top = `${mouseEvent.clientY + 8}px`
  popover.style.left = `${mouseEvent.clientX + 8}px`
}

document.addEventListener('click', e => {
  if (!popover.contains(e.target)) {
    popover.hidden = true
  }
})

document.getElementById('add-event-btn').addEventListener('click', () => {
  console.log('add-event-btn')
  popover.hidden = true

  dateInput.value = selectedDate
  titleInput.value = ''
  descInput.value = ''

  modal.hidden = false
  modal.style.display = 'block'
})

document.getElementById('save-btn').onclick = async () => {
  const payload = {
    title: titleInput.value,
    description: descInput.value,
    date: dateInput.value
  }

  if (!payload.title) {
    alert('Введите название')
    return
  }

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