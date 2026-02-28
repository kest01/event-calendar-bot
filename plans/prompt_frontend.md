# Промт для фронтенда: добавление выбора типа события (event_type)

## Контекст проекта

Это Telegram Mini App — календарь событий. Фронтенд написан на **Vanilla JS** (ES-модули, сборка через Vite). Стили адаптированы под Telegram-тему через CSS-переменные `--tg-theme-*`.

### Ключевые файлы

- [`frontend/index.html`](../frontend/index.html) — HTML-разметка, содержит два модальных окна:
  - `#event-modal` — форма создания/редактирования события
  - `#event-details-modal` — просмотр деталей события
- [`frontend/src/calendar/add_event.js`](../frontend/src/calendar/add_event.js) — логика формы создания/редактирования события
- [`frontend/src/calendar/event_details.js`](../frontend/src/calendar/event_details.js) — логика модального окна деталей события
- [`frontend/src/calendar/calendar.js`](../frontend/src/calendar/calendar.js) — инициализация FullCalendar, маппинг событий из API
- [`frontend/src/styles/calendar/add_event.css`](../frontend/src/styles/calendar/add_event.css) — стили формы и модальных окон
- [`frontend/src/styles/calendar/event_details.css`](../frontend/src/styles/calendar/event_details.css) — стили модального окна деталей

### Существующие CSS-переменные (из `add_event.css`)

```css
--overlay-bg: var(--tg-theme-secondary-bg-color, #f5f5f5)
--overlay-text: var(--tg-theme-text-color, #222)
--field-bg: color-mix(in srgb, var(--tg-theme-secondary-bg-color, #f5f5f5) 92%, var(--tg-theme-bg-color, #fff))
--field-border: color-mix(in srgb, var(--tg-theme-text-color, #222) 14%, transparent)
```

---

## Задача

Добавить поле **«Тип события»** в форму создания/редактирования события и отображение типа в карточке деталей события.

### Возможные типы и их отображаемые названия

| Значение (`event_type`) | Отображаемое название |
|---|---|
| `Тренировка` | 🏃 Тренировка |
| `Встреча` | 🤝 Встреча |
| `Клубный старт` | 🏁 Клубный старт |
| `Прочее` | 📌 Прочее |

---

## Что нужно сделать

### 1. HTML — файл `frontend/index.html`

#### 1.1. В форму `#event-modal` добавить поле выбора типа

Вставить **перед** блоком `<label class="field">` с полем «Название» (первое поле формы):

```html
<div class="field">
  <span class="field-label">Тип события</span>
  <div class="event-type-selector" id="event-type-selector">
    <button type="button" class="event-type-btn" data-value="Тренировка">🏃 Тренировка</button>
    <button type="button" class="event-type-btn" data-value="Встреча">🤝 Встреча</button>
    <button type="button" class="event-type-btn" data-value="Клубный старт">🏁 Клубный старт</button>
    <button type="button" class="event-type-btn" data-value="Прочее">📌 Прочее</button>
  </div>
  <input id="event-type" type="hidden" value="Прочее" />
</div>
```

> Используется скрытый `<input id="event-type">` для хранения выбранного значения. Кнопки-чипы визуально отображают выбор.

#### 1.2. В модальное окно `#event-details-modal` добавить отображение типа

Вставить **первой строкой** внутри блока `<div class="event-meta">`, перед строкой «Когда»:

```html
<div class="meta-row" id="details-type-block">
  <span class="meta-label">Тип</span>
  <span class="meta-value" id="details-type"></span>
</div>
```

---

### 2. JavaScript — файл `frontend/src/calendar/add_event.js`

#### 2.1. Добавить ссылку на новые DOM-элементы

В блок объявления переменных (после `const photoInput = ...`) добавить:

```js
const eventTypeInput = document.getElementById('event-type')
const eventTypeSelector = document.getElementById('event-type-selector')
```

#### 2.2. Инициализировать логику выбора типа в `initAddEventModal`

В функцию `initAddEventModal` добавить инициализацию кнопок-чипов:

```js
// Инициализация выбора типа события
eventTypeSelector.querySelectorAll('.event-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    eventTypeSelector.querySelectorAll('.event-type-btn').forEach(b => b.classList.remove('selected'))
    btn.classList.add('selected')
    eventTypeInput.value = btn.dataset.value
  })
})
```

#### 2.3. Сбрасывать тип при открытии формы создания нового события

В обработчике клика `#add-event-btn` (после `photoInput.value = ''`) добавить:

```js
eventTypeInput.value = 'Прочее'
setEventType('Прочее')
```

#### 2.5. Добавить вспомогательную функцию `setEventType`

```js
function setEventType(value) {
  eventTypeSelector.querySelectorAll('.event-type-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === value)
  })
  eventTypeInput.value = value
}
```

#### 2.6. Включить `event_type` в payload при сохранении

В обработчике `#save-btn` в объект `payload` добавить:

```js
event_type: eventTypeInput.value || 'Прочее',
```

#### 2.7. Заполнять тип при редактировании события

В функцию `editEvent(event)` добавить:

```js
setEventType(event.extendedProps.eventType || 'Прочее')
```

---

### 3. JavaScript — файл `frontend/src/calendar/calendar.js`

В маппинге событий из API (внутри `events: async (...)`) добавить `eventType` в `extendedProps`:

```js
extendedProps: {
  date: parseDateFromIsoTime(event.start_time),
  time: parseTimeFromIsoTime(event.start_time),
  description: event.description,
  place: event.place,
  photo: event.photo,
  ownerId: event.owner_id,
  eventType: event.event_type,  // <-- добавить
}
```

---

### 4. JavaScript — файл `frontend/src/calendar/event_details.js`

#### 4.1. Отображать тип в `openEventDetails`

В функцию `openEventDetails(event)` добавить (например, после установки `details-title`):

```js
const eventType = event.extendedProps.eventType || 'other'
document.getElementById('details-type').textContent = eventType
```

---

### 5. CSS — файл `frontend/src/styles/calendar/add_event.css`

Добавить стили для кнопок-чипов выбора типа события:

```css
/* Селектор типа события */
.event-type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.event-type-btn {
  flex: 1 1 auto;
  min-width: 0;
  padding: 7px 10px;
  font-size: 13px;
  border-radius: 10px;
  border: 1px solid var(--field-border);
  background: var(--field-bg);
  color: var(--tg-theme-text-color, #222);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  white-space: nowrap;
  text-align: center;
}

.event-type-btn.selected {
  background: var(--tg-theme-button-color, #2ea6ff);
  color: var(--tg-theme-button-text-color, #fff);
  border-color: var(--tg-theme-button-color, #2ea6ff);
}

.event-type-btn:active {
  transform: scale(0.97);
}
```

---

## Ожидаемое поведение

1. При открытии формы создания нового события — по умолчанию выбран тип «📌 Прочее» (кнопка подсвечена).
2. Пользователь может выбрать один из четырёх типов, нажав на соответствующую кнопку-чип.
3. При редактировании существующего события — тип подставляется из данных события.
4. Выбранный тип отправляется на сервер в поле `event_type` при сохранении.
5. В модальном окне деталей события отображается строка «Тип» с иконкой и названием типа.

## Ограничения и требования к стилю

- Не использовать `<select>` — только кнопки-чипы для лучшего UX в Telegram Mini App.
- Все цвета — через CSS-переменные `--tg-theme-*` для поддержки светлой и тёмной темы Telegram.
- Не изменять существующие стили и классы — только добавлять новые.
- Не использовать сторонние библиотеки.
