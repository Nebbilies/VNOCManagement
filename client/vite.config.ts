import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    plugins: [
        react(),
        mkcert(),
        tailwindcss(),
    ],
    server: {
        https: false,
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
})
