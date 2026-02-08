

export function showElement(el, display = 'block') {
    el.hidden = false
    el.style.display = display
}

export function hideElement(el) {
    el.hidden = true
    el.style.display = 'none'
}

export function getEventCoordinates(event) {
  if (event.touches && event.touches.length > 0) {
    // Touch событие
    const touch = event.touches[0]
    return {
      clientX: touch.clientX,
      clientY: touch.clientY
    }
  } else if (event.changedTouches && event.changedTouches.length > 0) {
    // Для событий touchend/touchcancel
    const touch = event.changedTouches[0]
    return {
      clientX: touch.clientX,
      clientY: touch.clientY
    }
  } else {
    // Mouse событие
    return {
      clientX: event.clientX,
      clientY: event.clientY
    }
  }
}