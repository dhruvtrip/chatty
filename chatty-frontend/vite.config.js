import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define:{
    global: 'window'
  },
  server: {
      port: 5173,
      proxy: {
        '/ws': {
          target: 'http://localhost:8080',
          ws: true,
          changeOrigin: true,
          secure: false
        },
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: p => p.replace(/^\/api/, '')
        }
      }
    }
})
