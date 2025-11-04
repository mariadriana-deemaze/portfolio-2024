import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }
})
