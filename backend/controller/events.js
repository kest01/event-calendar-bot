import { db } from '../db.js'

export function getEvents(req, res) {
      const { start_date } = req.query

  db.all(
    `
    SELECT *
    FROM events
    WHERE date >= ?
    `,
    [start_date],
    (err, rows) => {
      if (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message })
      }

      // формат под FullCalendar
      const events = rows.map(row => ({
        id: row.id,
        title: row.title,
        date: row.date,
        description: row.description,
        place: row.place,         
        photo: row.photo         
      }))

      res.json(events)
    }
  )
}

export function createEvent(req, res) {
      const { title, date, description, place, photo } = req.body

  db.run(
    `
    INSERT INTO events (title, date, description, place, photo)
    VALUES (?, ?, ?, ?, ?)
    `,
    [title, date, description, place, photo],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.json({ id: this.lastID })
    }
  )
}