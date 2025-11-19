/* eslint-env node */
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development/production)
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Proxy API requests to the backend during development
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})