import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Thiunk-Outside-the-box/',
  root: '.',
  publicDir: 'Assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true
  }
});
