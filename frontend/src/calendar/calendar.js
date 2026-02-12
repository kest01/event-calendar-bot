import { Calendar } from '@fullcalendar/core'
import multiMonthPlugin from '@fullcalendar/multimonth'
import interactionPlugin from '@fullcalendar/interaction';
import { showEventTooltip, hideEventTooltip } from './event_tooltip'
import { showAddEventPopover, initAddEventModal, closeAddEventModal } from './add_event'
import { openEventDetails, closeEventDetails, initEventDetailsModal } from './event_details'

export function initCalendar(userContext) {
  const calendarEl = document.getElementById('calendar')

  const calendar = new Calendar(calendarEl, {
    plugins: [multiMonthPlugin, interactionPlugin],

    initialView: 'multiMonthYear',
    selectable: false,
    selectMirror: false,

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
          start_time: info.startStr
        })
        if (userContext.groupId) {
          params.append("group_id", userContext.groupId)
        }

        const response = await fetch(
          `/api/events?${params}`
        )

        const events = (await response.json()).map(event => ({
            id: event.id,
            title: event.title,
            date: parseDateFromIsoTime(event.start_time),
            extendedProps: {
              date: parseDateFromIsoTime(event.start_time),
              time: parseTimeFromIsoTime(event.start_time),
              description: event.description,
              place: event.place,
              photo: event.photo,
            }
          })
        )
        // console.log(events)
        successCallback(events)
      } catch (e) {
        failureCallback(e)
      }
    },

    eventMouseEnter(info) {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      if (isTouchDevice) return
      showEventTooltip(info)
    },

    eventMouseLeave() {
      hideEventTooltip()
    },

    dateClick(info) {
      // alert('dateClick()')
      showAddEventPopover(info)
    },

    eventClick(info) {
      // console.log("eventClick: " + info)
      info.jsEvent.preventDefault()
      info.jsEvent.stopPropagation()

      openEventDetails(info.event)
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

  initAddEventModal(calendar, userContext)
  initEventDetailsModal(userContext)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('event-details-modal').hidden) {
      closeEventDetails()
    }
    if (e.key === 'Escape' && !document.getElementById('event-modal').hidden) {
      closeAddEventModal()
    }
  })
}

function getCalendarColumns() {
  return window.matchMedia('(min-width: 900px)').matches ? 2 : 1
}

function parseDateFromIsoTime(isoDate) {
  return isoDate.split('T')[0]
}

function parseTimeFromIsoTime(isoDate) {
  const date = new Date(isoDate)
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`
  return time == '00:00' ? null : time
}
