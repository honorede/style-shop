import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← ЭТОТ ИМПОРТ

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),  // ← ЭТОТ ПЛАГИН
    ],
})