import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
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
        '@/hooks': resolve('src/rendered/src/hooks'),
        '@/assets': resolve('src/rendered/src/assets'),
        '@/store': resolve('src/rendered/src/store'),
        '@/components': resolve('src/rendered/src/components'),
        '@/mocks': resolve('src/rendered/src/mocks')
      }
    },
    plugins: [react()]
  }
})
