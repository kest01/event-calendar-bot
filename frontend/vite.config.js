import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'frontend',
  base: '/',
  build: {
    outDir: path.resolve(__dirname, '../dist/frontend'),
    emptyOutDir: true
  }
})