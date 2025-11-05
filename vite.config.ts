import { defineConfig } from "vite";

// EcoVillage uses a single-file Express server (server-complete.js)
// No Vite build is needed - this config is for Lovable compatibility only
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "index.html"
    }
  },
  server: {
    port: 8080,
    host: "::",
    proxy: {
      '/api': 'http://localhost:5001',
      '/images': 'http://localhost:5001'
    }
  }
});
