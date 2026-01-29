import fs from 'fs'
import path from 'path'

const src = 'backend'
const dest = 'dist/backend'

fs.rmSync(dest, { recursive: true, force: true })
fs.mkdirSync(dest, { recursive: true })

for (const file of fs.readdirSync(src)) {
  fs.copyFileSync(
    path.join(src, file),
    path.join(dest, file)
  )
}

console.log('Backend prepared')