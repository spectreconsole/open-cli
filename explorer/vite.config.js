import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [
    vue({
      features: { customElement: true },
    }),
  ],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'OpenCliExplorer',
      formats: ['iife'],
      fileName: () => 'opencli-explorer.js',
    },
    emptyOutDir: true,
  },
})
