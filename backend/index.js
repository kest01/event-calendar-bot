import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import './bot.js'
import { getEvents, createEvent } from './controller/events.js'
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
app.post('/api/events', createEvent)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Webserver started!')
  // console.log(process.env)
})