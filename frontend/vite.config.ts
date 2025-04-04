import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@backend": path.resolve(__dirname, "../backend"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://miniproject-attempt-infinity-1.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
