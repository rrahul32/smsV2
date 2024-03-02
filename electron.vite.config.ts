import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    envDir: './',
    envPrefix: 'MAIN',
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@lib': resolve('src/main/lib')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/rendered/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/api': resolve('src/renderer/src/api'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/pages': resolve('src/renderer/src/pages'),
        '@/types': resolve('src/renderer/src/types'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/store': resolve('src/renderer/src/store'),
        '@/components': resolve('src/renderer/src/components'),
        '@/contexts': resolve('src/renderer/src/contexts')
      }
    },
    plugins: [react()]
  }
})
