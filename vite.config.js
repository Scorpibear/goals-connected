import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/goals-connected/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(version)
  }
})
