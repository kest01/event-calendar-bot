import { db } from './db.js'

// Начальные данные для таблицы groups
const initialGroups = [
  {
    group_id: '3259485766946657054',
    title: 'Календарь событий тестового сообщества!',
    admins: JSON.stringify([234436619])
  }
]

// Функция обновления схемы данных
function updateSchema() {
  console.log('Начало обновления схемы данных...')
  
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
  
  console.log('Обновления схемы данных завершено')
}


// Функция для загрузки начальных данных
function seedGroups() {
  console.log('Начало загрузки начальных данных для таблицы groups...')
  
  initialGroups.forEach(group => {
    db.run(
      `
      INSERT OR IGNORE INTO groups (group_id, title, admins)
      VALUES (?, ?, ?)
      `,
      [group.group_id, group.title, group.admins],
      function(err) {
        if (err) {
          console.error(`Ошибка при добавлении группы ${group.group_id}:`, err.message)
        } else if (this.changes > 0) {
          console.log(`Группа ${group.group_id} успешно добавлена`)
        } else {
          console.log(`Группа ${group.group_id} уже существует`)
        }
      }
    )
  })
  
  console.log('Загрузка начальных данных завершена')
}

// Запуск при импорте модуля
function runMigrations() {
  updateSchema()
  seedGroups()
}

runMigrations()

export { runMigrations }