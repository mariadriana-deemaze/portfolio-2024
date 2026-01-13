import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-vite-plugin'

export default defineConfig(() => {
  return {
    plugins: [tanstackRouter(), react()],
    resolve: {
      alias: [
        { find: '@/server', replacement: path.resolve(__dirname, 'server') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    },
  }
})
