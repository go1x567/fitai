import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiPaths = ['/auth', '/catalog', '/upload', '/tryon', '/outfits', '/me', '/cart', '/admin', '/public', '/health'];
const proxy = Object.fromEntries(apiPaths.map(p => [p, { target: 'http://127.0.0.1:3001', changeOrigin: true }]));

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy,
    allowedHosts: true,
  },
})
