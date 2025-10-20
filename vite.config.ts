import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    manifest: true,
    outDir: "dist/client",
    rollupOptions: {
      input: "/src/main.tsx",
    },
  },
  ssr: {
    noExternal: [/^react-helmet-async/],
  },
});
