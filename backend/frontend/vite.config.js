import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss() // plugins array should only contain plugin functions
  ],
  server: {
    port: 5173 // server config is at the root level, not inside plugins
  }
})
