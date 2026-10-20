import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from the domain root on Vercel. BASE_PATH is only needed if the site is ever hosted at a sub-path.
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: { assetsInlineLimit: 0 },
});
