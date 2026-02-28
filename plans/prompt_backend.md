# Промт для бэкенда: добавление типа события (event_type)

## Контекст проекта

Это Telegram Mini App — календарь событий. Бэкенд написан на **Node.js** (ES-модули), использует **SQLite** через пакет `sqlite3`. Точка входа — `backend/index.js`, база данных инициализируется в `backend/db.js`, миграции — в `backend/migrations.js`, CRUD для событий — в `backend/controller/events.js`.

Текущая схема таблицы `events` (из `backend/db.js`):

```sql
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id TEXT,
  start_time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  place TEXT,
  photo TEXT,
  owner_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

## Задача

Добавить в таблицу `events` новое поле `event_type` — тип события. Возможные значения:

- `training` — Тренировка
- `meeting` — Встреча
- `club_race` — Клубный старт
- `other` — Прочее

Значение по умолчанию: `Прочее`.

---

## Что нужно сделать

### 1. Миграция схемы БД — файл `backend/migrations.js`

В функции `updateSchema()` добавить выполнение ALTER TABLE для добавления нового столбца. Использовать паттерн, уже применённый в закомментированном примере в этом файле:

```js
db.run(
  `ALTER TABLE events ADD COLUMN event_type TEXT NOT NULL DEFAULT 'Прочее'`,
  [],
  function(err) {
    if (err) {
      // Если столбец уже существует — SQLite вернёт ошибку "duplicate column name"
      // Это нормально, просто логируем
      if (!err.message.includes('duplicate column name')) {
        console.error('Ошибка при добавлении event_type:', err.message)
      } else {
        console.log('Столбец event_type уже существует')
      }
    } else {
      console.log('Столбец event_type успешно добавлен')
    }
  }
)
```

---

### 2. Контроллер событий — файл `backend/controller/events.js`

#### 2.1. Функция `getEvents`

В маппинге результатов добавить поле `event_type`:

```js
const events = rows.map(row => ({
  id: row.id,
  group_id: row.group_id,
  title: row.title,
  start_time: row.start_time,
  description: row.description,
  place: row.place,
  photo: row.photo,
  owner_id: row.owner_id,
  created_at: row.created_at,
  event_type: row.event_type  // <-- добавить
}))
```

#### 2.2. Функция `saveEvent`

Добавить `event_type` в деструктуризацию из `req.body`:

```js
const { id, group_id, title, start_time, description, place, photo, owner_id, event_type } = req.body
```

В ветке **UPDATE** добавить `event_type` в SET:

```sql
UPDATE events SET
  group_id = ?,
  title = ?,
  start_time = ?,
  description = ?,
  place = ?,
  photo = ?,
  owner_id = ?,
  event_type = ?
WHERE id = ?
```

Параметры: `[group_id, title, start_time, description, place, photo, owner_id, resolvedEventType, id]`

В ветке **INSERT** добавить `event_type` в список столбцов и значений:

```sql
INSERT INTO events (group_id, title, start_time, description, place, photo, owner_id, event_type, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
```

Параметры: `[group_id, title, start_time, description, place, photo, owner_id, resolvedEventType]`

---

## Ожидаемый результат

- При GET `/api/events` каждый объект события содержит поле `event_type`.
- При POST `/api/events` поле `event_type` принимается из тела запроса и сохраняется в БД. Если значение не передано — сохраняется `'Прочее'`.
- Существующие записи в БД получают значение `event_type = 'Прочее'` автоматически через DEFAULT в миграции.
- Никаких изменений в других файлах бэкенда не требуется.
