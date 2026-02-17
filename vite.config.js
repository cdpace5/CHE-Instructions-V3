import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/che-instructions-v3/", // Add this line. Must match your GitHub repo name exactly.
})
