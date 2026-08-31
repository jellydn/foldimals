import stylex from '@stylexjs/unplugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    stylex.vite({
      dev: mode === 'development',
      devMode: mode === 'development' ? 'css-only' : 'off',
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: process.cwd(),
      },
      useCSSLayers: true,
    }),
    react(),
  ],
  server: {
    allowedHosts: ['.onamp.dev'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
}))
