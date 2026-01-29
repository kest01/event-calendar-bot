import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import './bot.js'
import './api.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

// frontend
app.use(express.static(path.join(__dirname, '../frontend')))

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(XXXINLINECODEXXX4XXXINLINECODEXXX)
})