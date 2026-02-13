import { db } from './db.js'

// Начальные данные для таблицы groups
const initialGroups = [
  {
    group_id: '3259485766946657054',
    title: 'Календарь событий тестового сообщества!',
    admins: JSON.stringify([234436619])
  }
]

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
seedGroups()

export { seedGroups }
