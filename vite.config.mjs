import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      input: {
        landing: "index.html",
        app: "app.html",
      },
    },
  },
  plugins: [VitePWA({ registerType: "autoUpdate", manifest: false })],
});
