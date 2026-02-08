import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const src = 'backend'
const dest = 'dist/backend'

// Функция для рекурсивного копирования директорий
function copyDir(src, dest) {
  // Удаляем целевую директорию, если она существует
  fs.rmSync(dest, { recursive: true, force: true })
  
  // Создаем целевую директорию
  fs.mkdirSync(dest, { recursive: true })
  
  // Читаем содержимое исходной директории
  const items = fs.readdirSync(src, { withFileTypes: true })
  
  for (const item of items) {
    const srcPath = path.join(src, item.name)
    const destPath = path.join(dest, item.name)
    
    if (item.isDirectory()) {
      // Если это директория - рекурсивно копируем её
      copyDir(srcPath, destPath)
    } else {
      // Если это файл - копируем его
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Выполняем копирование
copyDir(src, dest)

console.log('Backend prepared')