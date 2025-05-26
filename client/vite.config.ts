import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import mkcert from 'vite-plugin-mkcert'

// ✅ Thêm đường proxy
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
                target: 'http://localhost:3001', // Địa chỉ backend
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }
})
