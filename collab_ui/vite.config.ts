import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/assets/krcs_x_ifaw/collab_ui/',
  build: {
    outDir: '../krcs_x_ifaw/public/collab_ui',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
  server: {
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
