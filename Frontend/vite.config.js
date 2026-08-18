import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:5127",
        changeOrigin: true,
      },
      "/notificationHub": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:5127",
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
