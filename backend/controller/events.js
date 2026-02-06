import { db } from '../db.js'

export function getEvents(req, res) {
      const { start_time, group_id } = req.query
  // console.log(`Search events. group_id = ${group_id}, start_time = ${start_time}`)
  db.all(
    `
    SELECT *
    FROM events
    WHERE start_time >= ? AND group_id ${group_id ? '=?' + group_id : 'is NULL'} 
    `,
    [start_time, group_id],
    (err, rows) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }

      const events = rows.map(row => ({
        id: row.id,
        group_id: row.group_id,
        title: row.title,
        start_time: row.start_time,
        description: row.description,
        place: row.place,         
        photo: row.photo         
      }))

      res.json(events)
    }
  )
}

export function saveEvent(req, res) {
  console.log('Save event ' + JSON.stringify(req.body))
  const { id, group_id, title, start_time, description, place, photo } = req.body

  if (id) {
    db.run(
      `
      UPDATE events SET 
        group_id = ?, 
        title = ?, 
        start_time = ?, 
        description = ?, 
        place = ?, 
        photo = ?
      WHERE id = ?
      `,
      [group_id, title, start_time, description, place, photo, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        res.json({ id: this.lastID })
      }
    )
  } else {
    db.run(
      `
      INSERT INTO events (group_id, title, start_time, description, place, photo)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [group_id, title, start_time, description, place, photo],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }

        res.json({ id: this.lastID })
      }
    )
  }
}