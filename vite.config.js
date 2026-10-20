import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      devOptions: {
        enabled: true // This lets you install the app while testing on localhost
      },
      manifest: {
        name: 'NexPay App',
        short_name: 'NexPay',
        description: 'Your easy payment solution',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/NEXPAY.png', // We use your existing logo
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/NEXPAY.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})