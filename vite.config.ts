import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/leet-algo-visualizer/',
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
    port: 5173,
  },
});
