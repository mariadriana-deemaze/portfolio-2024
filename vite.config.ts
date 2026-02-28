import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tanstackStart(), react(), tsconfigPaths()],
  server: {
    allowedHosts: ['maria-adriana.com', 'www.maria-adriana.com'],
  },
  preview: {
    allowedHosts: ['maria-adriana.com', 'www.maria-adriana.com'],
  },
})
