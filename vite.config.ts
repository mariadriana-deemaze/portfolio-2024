import { tanstackRouter } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  const rootDir = path.dirname(fileURLToPath(import.meta.url))

  return {
    plugins: [tanstackRouter(), react()],
    resolve: {
      alias: [
        { find: '@/server', replacement: path.resolve(rootDir, 'server') },
        { find: '@', replacement: path.resolve(rootDir, 'src') },
      ],
    },
  }
})
