let tooltip

export function showEventTooltip(info) {
  hideEventTooltip()

  const event = info.event
  const { description, coach, place } = event.extendedProps

  tooltip = document.createElement('div')
  tooltip.className = 'fc-tooltip'

  tooltip.innerHTML = `
    <strong>${event.title}</strong>
    ${description ? `<p>${description}</p>` : ''}
    ${coach ? `<div>Тренер: ${coach}</div>` : ''}
    ${place ? `<div>Место: ${place}</div>` : ''}
  `

  document.body.appendChild(tooltip)

  positionTooltip(info.el, tooltip)
}

export function hideEventTooltip() {
  tooltip?.remove()
  tooltip = null
}

function positionTooltip(targetEl, tooltipEl) {
  const margin = 8

  const targetRect = targetEl.getBoundingClientRect()
  const tooltipRect = tooltipEl.getBoundingClientRect()

  let top = targetRect.bottom + margin
  let left = targetRect.left

  // 👉 если выходит за правый край
  if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - margin
  }

  // 👉 если выходит за левый край
  if (left < margin) {
    left = margin
  }

  // 👉 если выходит за нижний край
  if (top + tooltipRect.height > window.innerHeight) {
    top = targetRect.top - tooltipRect.height - margin
  }

  // финальные координаты
  tooltipEl.style.left = left + window.scrollX + 'px'
  tooltipEl.style.top = top + window.scrollY + 'px'
}
