import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // <--- 1. IMPORT

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. CONFIGURATION PWA
    VitePWA({
      registerType: 'prompt', // Affiche le modal quand une maj est dispo
      devOptions: {
        enabled: true // Permet de tester même en local (localhost)
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // Manifeste minimal pour éviter les erreurs (tu pourras personnaliser plus tard)
      manifest: {
        name: 'KevySpace',
        short_name: 'KevySpace',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // Assure-toi d'avoir une icône ou ignore l'erreur console pour l'instant
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})