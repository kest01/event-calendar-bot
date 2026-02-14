import express from 'express'
import path from 'path'
import cors from 'cors'
import 'dotenv/config'
import './bot.js'
import { runMigrations } from './migrations.js'
import { getEvents, saveEvent } from './controller/events.js'
import {
  getEventParticipants,
  setUserParticipation,
  removeUserParticipation
} from './controller/participants.js'
import { getGroupInfo } from './controller/groups.js'
import { currentDir } from './utils.js'

const __dirname = currentDir()

const app = express()
app.use(cors())
app.use(express.json())

// frontend
if (process.env.FRONTEND_ENABLED) {
  app.use(express.static(path.join(__dirname, '../frontend')))

  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
  })
}

app.get('/api/events', getEvents)
app.post('/api/events', saveEvent)

// Participation endpoints
app.get('/api/events/:event_id/participants', getEventParticipants)
app.post('/api/participants', setUserParticipation)
app.delete('/api/events/:event_id/participants/:user_id', removeUserParticipation)

// Groups endpoints
app.get('/api/groups/:group_id', getGroupInfo)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Webserver started!')
  // console.log(process.env)
})