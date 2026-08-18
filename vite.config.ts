import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // El servidor de desarrollo se mira desde el teléfono a través de un túnel
    // rápido de Cloudflare, y ese subdominio **cambia en cada arranque**: un
    // host escrito a mano deja de servir en cuanto se reinicia el túnel. El
    // prefijo `.` cubre cualquier subdominio de la familia, así que no hay que
    // volver a tocar este archivo.
    //
    // Solo afecta a `vite dev`: el artefacto que se publica no lo lee, y
    // `must-privacy-006` sigue prohibiendo cualquier petición de red en
    // tiempo de ejecución de la aplicación.
    allowedHosts: ['.trycloudflare.com'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
})
