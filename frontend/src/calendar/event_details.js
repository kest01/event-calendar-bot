import { hideElement, showElement } from "../utils"
import { editEvent } from "./add_event"

const eventDetailsModel = document.getElementById('event-details-modal')
const detailsImg = document.getElementById('details-photo')

let currentEvent

export function initEventDetailsModal() {
    const overlay = eventDetailsModel.querySelector('.modal-overlay')
    overlay.addEventListener('click', closeEventDetails)

    document.querySelector('.event-details-edit-btn')
        .addEventListener('click', (e) => {
            // console.log(e)
            // console.log(currentEvent)
            closeEventDetails()
            editEvent(currentEvent)
        })
}

export function openEventDetails(event) {
  currentEvent = event  
  document.getElementById('details-title').textContent = event.title

  document.getElementById('details-description').textContent = event.extendedProps.description

  document.getElementById('details-date').textContent = event.extendedProps.date
  document.getElementById('details-time').textContent = event.extendedProps.time

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

  showElement(eventDetailsModel)
}

export function closeEventDetails() {
    hideElement(eventDetailsModel)
}