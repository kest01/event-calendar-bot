import sqlite3 from "sqlite3"; 
import path from 'path'
import { currentDir } from './utils.js'
import 'dotenv/config'

sqlite3.verbose();

const __dirname = process.env.LOCAL ? currentDir() : ""

export const db = new sqlite3.Database(
  path.join(__dirname + '/data', 'db.sqlite')
)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT,
      start_time TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      place TEXT,
      photo TEXT,
      owner_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
  console.log('Database is created and connected')
})

