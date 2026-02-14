import { db } from '../db.js'

// Получить всех участников события, сгруппированных по типу участия
export function getEventParticipants(req, res) {
  const { event_id } = req.params

  db.all(
    `
    SELECT 
      id,
      event_id,
      user_id,
      first_name,
      last_name,
      username, 
      avatar_url,
      participation_type
    FROM event_participants
    WHERE event_id = ?
    ORDER BY created_at ASC
    `,
    [event_id],
    (err, rows) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }

      // Группируем участников по типу участия
      const participants = {
        maybe: [],
        sure: []
      }

      rows.forEach(row => {
        const participant = {
          id: row.id,
          user_id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          username: row.username,
          avatar_url: row.avatar_url
        }

        if (row.participation_type === 'maybe') {
          participants.maybe.push(participant)
        } else if (row.participation_type === 'sure') {
          participants.sure.push(participant)
        }
      })

      res.json(participants)
    }
  )
}

// Создать или обновить статус участия пользователя
export function setUserParticipation(req, res) {
  console.log('setUserParticipation: ' + JSON.stringify(req.body))
  const { event_id, user_id, first_name, last_name, username, avatar_url, participation_type } = req.body

  // Валидация обязательных полей
  if (!event_id || !user_id || !participation_type) {
    return res.status(400).json({ 
      error: 'Missing required fields: event_id, user_id, participation_type' 
    })
  }

  // Валидация типа участия
  if (participation_type !== 'maybe' && participation_type !== 'sure') {
    return res.status(400).json({ 
      error: 'Invalid participation_type. Must be "maybe" or "sure"' 
    })
  }

  // Проверяем, существует ли уже запись
  db.get(
    `SELECT id FROM event_participants WHERE event_id = ? AND user_id = ?`,
    [event_id, user_id],
    (err, row) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }

      if (row) {
        // Обновляем существующую запись
        db.run(
          `
          UPDATE event_participants 
          SET 
            first_name = ?,
            last_name = ?,
            username = ?,
            avatar_url = ?,
            participation_type = ?,
            updated_at = datetime('now')
          WHERE event_id = ? AND user_id = ?
          `,
          [first_name, last_name, username, avatar_url, participation_type, event_id, user_id],
          function (err) {
            if (err) {
              console.error(err.message)
              return res.status(500).json({ error: err.message })
            }

            res.json({ 
              id: row.id,
              event_id,
              user_id,
              first_name,
              last_name,
              username,
              avatar_url,
              participation_type,
              updated: true
            })
          }
        )
      } else {
        // Создаем новую запись
        db.run(
          `
          INSERT INTO event_participants 
            (event_id, user_id, first_name, last_name, username, avatar_url, participation_type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `,
          [event_id, user_id, first_name, last_name, username, avatar_url, participation_type],
          function (err) {
            if (err) {
              console.error(err.message)
              return res.status(500).json({ error: err.message })
            }

            res.status(201).json({ 
              id: this.lastID,
              event_id,
              user_id,
              first_name,
              last_name,
              username,
              avatar_url,
              participation_type,
              created: true
            })
          }
        )
      }
    }
  )
}

// Удалить участие пользователя в событии
export function removeUserParticipation(req, res) {
  console.log('removeUserParticipation: ' + JSON.stringify(req.params))
  const { event_id, user_id } = req.params

  db.run(
    `DELETE FROM event_participants WHERE event_id = ? AND user_id = ?`,
    [event_id, user_id],
    function (err) {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Participation not found' })
      }

      res.json({ success: true, deleted: this.changes })
    }
  )
}
