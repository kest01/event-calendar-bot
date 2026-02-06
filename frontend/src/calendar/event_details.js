import { hideElement, showElement } from "../utils"

const eventDetailsModel = document.getElementById('event-details-modal')

export function initEventDetailsModal() {
    const overlay = eventDetailsModel.querySelector('.modal-overlay')
    overlay.addEventListener('click', closeEventDetails)
}

export function openEventDetails(event) {
  console.log(event.title)  
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

  showElement(eventDetailsModel)
}

export function closeEventDetails() {
    hideElement(eventDetailsModel)
}