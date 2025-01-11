import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        archive: 'archive.html',
      },
    },
  },
})