import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'frontend',
  base: '/',
  build: {
    outDir: path.resolve(__dirname, '../dist/frontend'),
    emptyOutDir: true
  },
    server: {
    proxy: {
      // Proxy requests that start with '/api'
      '/api': {
        target: 'http://localhost:3000', // The address of your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        // rewrite: (path) => path.replace(/^\/api/, ''), // Rewrite the path: remove '/api' prefix
      },
    },
  },
})