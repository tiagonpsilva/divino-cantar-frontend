import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/divino-cantar-frontend/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Garantir que assets públicos sejam copiados corretamente
  publicDir: 'public',
})