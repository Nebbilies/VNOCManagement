import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import mkcert from 'vite-plugin-mkcert'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      mkcert(),
      tailwindcss(),
  ],
    server: {
        https: false, // Make sure this is false
        port: 5173,   // Optional: change the port if needed
    }

})
