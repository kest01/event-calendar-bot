import { Calendar } from '@fullcalendar/core'
import multiMonthPlugin from '@fullcalendar/multimonth'
import {showTooltip, hideTooltip} from './tooltip.js'

export function initCalendar() {
  const calendarEl = document.getElementById('calendar')

  const calendar = new Calendar(calendarEl, {
    plugins: [multiMonthPlugin],

    initialView: 'multiMonthYear',

    views: {
      multiMonthYear: {
        duration: { months: 6 },
        multiMonthMaxColumns: getCalendarColumns()
      }
    },

    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },

    height: 'auto',

    events: async (info, successCallback, failureCallback) => {
    try {
      const params = new URLSearchParams({
        start_date: info.startStr
      })

      const response = await fetch(
        `/api/events?${params}`
      )

      const events = await response.json()
      successCallback(events)
    } catch (e) {
      failureCallback(e)
    }
  },

/*     events: [
      {
        id: '1',
        title: 'Тренировка',
        start: '2026-02-05',
        extendedProps: {
          description: 'Силовая тренировка в зале',
          coach: 'Иван Иванов',
          place: 'Зал №2'
        }
      },
      {
        id: '2',
        title: 'Соревнования',
        start: '2026-03-12',
        extendedProps: {
          description: 'Городской чемпионат',
          place: 'Стадион'
        }
      }
    ],
 */
    eventMouseEnter(info) {
      showTooltip(info)
    },

    eventMouseLeave() {
      hideTooltip()
    }
  })

  calendar.render()

  // перестроение при ресайзе
  window.addEventListener('resize', () => {
    calendar.setOption(
      'views',
      {
        multiMonthYear: {
          duration: { months: 6 },
          multiMonthMaxColumns: getCalendarColumns()
        }
      }
    )
  })
}

function getCalendarColumns() {
  return window.matchMedia('(min-width: 900px)').matches ? 2 : 1
}
