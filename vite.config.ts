import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'ThreeFpsEngine',
      fileName: 'fps-engine',
      formats: ['es', 'cjs', 'umd', 'iife']
    }
  }
})
