import { db } from './db.js'

// Начальные данные для таблицы groups
const initialGroups = [
  {
    group_id: '8090954990011115460',
    title: 'Календарь событий Булочной №1',
    admins: JSON.stringify([234436619, 797362624])
  }
]

// Функция обновления схемы данных
function updateSchema() {
  console.log('Начало обновления схемы данных...')
  
  db.run(
    `ALTER TABLE events ADD COLUMN link TEXT`,
    [],
    function(err) {
      if (err) {
        if (!err.message.includes('duplicate column name')) {
          console.error('Ошибка при добавлении link:', err.message)
        } else {
          console.log('Столбец link уже существует')
        }
      } else {
        console.log('Столбец link успешно добавлен')
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