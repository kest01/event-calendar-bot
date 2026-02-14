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
  
  db.run(`
    CREATE TABLE IF NOT EXISTS event_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      username TEXT,
      avatar_url TEXT,
      participation_type TEXT NOT NULL CHECK(participation_type IN ('maybe', 'sure')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(event_id, user_id)
    )
  `)
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_event_participants_event_id
    ON event_participants(event_id)
  `)
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_event_participants_user_id
    ON event_participants(user_id)
  `)
  
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      admins TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_groups_group_id
    ON groups(group_id)
  `)
  
  console.log('Database is created and connected')
})

