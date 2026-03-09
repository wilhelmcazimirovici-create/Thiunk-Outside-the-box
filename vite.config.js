import { defineConfig } from 'vite';

export default defineConfig({
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
