let tooltip

export function showTooltip(info) {
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

  const rect = info.el.getBoundingClientRect()
  tooltip.style.left = rect.left + window.scrollX + 'px'
  tooltip.style.top = rect.bottom + window.scrollY + 6 + 'px'
}

export function hideTooltip() {
  tooltip?.remove()
  tooltip = null
}
