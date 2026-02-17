import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['react-helmet-async', 'react-router-dom', 'react-router'],
  },
})
