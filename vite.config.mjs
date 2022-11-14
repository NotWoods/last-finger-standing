// @ts-check
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/last-finger-standing/",
  server: {
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist/last-finger-standing",
    rollupOptions: {
      input: {
        landing: "index.html",
        app: "app.html",
      },
    },
  },
  plugins: [VitePWA({ registerType: "autoUpdate", manifest: false })],
});
