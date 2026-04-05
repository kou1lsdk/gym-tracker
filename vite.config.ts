import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/gym-tracker/',
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __APP_VERSION__: JSON.stringify('2.1'),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'GymTracker — Фітнес Трекер',
        short_name: 'GymTracker',
        description: 'Трекер тренувань для набору м\'язової маси',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/gym-tracker/',
        scope: '/gym-tracker/',
        icons: [
          { src: '/gym-tracker/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/gym-tracker/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/gym-tracker/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
