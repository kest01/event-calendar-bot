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
    `
    ALTER TABLE event_participants ADD COLUMN username TEXT;
    `,
    [],
    function(err) {
      if (err) {
        console.error(`Ошибка при обновлении схемы: `, err.message)
      } else if (this.changes > 0) {
        console.log(`Схема успешно обновлена`)
      } else {
        console.log(`Схема была обновлена ранее`)
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