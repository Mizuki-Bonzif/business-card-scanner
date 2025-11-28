import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'Business Card Scanner - CardScanner',
        short_name: 'CardScanner',
        description: 'Scan business cards and extract vital information using OCR. Organize, search, and manage your business contacts with groups and events.',
        theme_color: '#81D4FA',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            form_factor: 'narrow'
          },
          {
            src: '/pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            form_factor: 'wide'
          }
        ],
        categories: ['productivity', 'utilities'],
        shortcuts: [
          {
            name: 'Take Photo',
            short_name: 'Camera',
            description: 'Take a photo of a business card',
            url: '/?action=camera',
            icons: [
              {
                src: '/pwa-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              }
            ]
          },
          {
            name: 'View Cards',
            short_name: 'Cards',
            description: 'View your scanned business cards',
            url: '/contacts',
            icons: [
              {
                src: '/pwa-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              }
            ]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    host: true
  }
})
