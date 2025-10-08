import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexiones externas
    port: 5173,      // Puerto por defecto de Vite
    allowedHosts: ['.ngrok-free.app'], // Permite cualquier dominio de ngrok
  },
})