import { tanstackRouter } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

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
