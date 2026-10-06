import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Expose TURNSTILE_SITE_KEY to the browser alongside the default VITE_ vars
  envPrefix: ["VITE_", "TURNSTILE_SITE_KEY"],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
