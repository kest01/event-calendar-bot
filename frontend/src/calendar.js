import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'

export function initCalendar() {
  const calendarEl = document.getElementById('calendar')

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    events: [
      {
        id: '1',
        title: 'Клубный старт 🏃‍♂️',
        date: '2026-02-05'
      },
      {
        id: '2',
        title: 'Тренировка',
        date: '2026-02-12'
      }
    ],
    eventClick(info) {
      alert(`Событие: ${info.event.title}`)
    }
  })

  calendar.render()
}
