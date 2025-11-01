import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  server: {
    open: true,
    proxy: {
      '/api': {
        // use process.env instead of import.meta.env
        target: process.env.VITE_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [tailwindcss(), react()],
})
