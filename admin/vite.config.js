import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // both plugins should be inside the same array
  ],
  server: {
    port: 5174 // server config at the root level
  }
})
