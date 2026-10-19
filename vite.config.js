import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // BASE_PATH lets the same build run at a sub-path (e.g. GitHub Pages: /rss-website/).
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: { assetsInlineLimit: 0 },
});
