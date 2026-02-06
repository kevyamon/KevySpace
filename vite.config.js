// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import packageJson from './package.json' // <--- On importe ta version Pro (1.1.0)

// --- 1. HASH GIT (Pour la détection technique fiable & auto) ---
const getGitHash = () => {
  try {
    if (process.env.RENDER_GIT_COMMIT) {
      return process.env.RENDER_GIT_COMMIT.trim();
    }
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    return Date.now().toString();
  }
};

const buildHash = getGitHash(); // ex: "a1b2c3d"

// --- 2. TON PLUGIN AUTOMATIQUE (On le garde !) ---
const generateVersionJson = () => {
  return {
    name: 'generate-version-json',
    writeBundle() {
      // On écrit le HASH dans le fichier version.json (pour la détection)
      const versionData = { version: buildHash };
      const outputPath = path.resolve(__dirname, 'dist', 'version.json');
      
      if (!fs.existsSync(path.resolve(__dirname, 'dist'))) {
        fs.mkdirSync(path.resolve(__dirname, 'dist'));
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(versionData));
      console.log(`✅ [Auto-Update] version.json généré avec Hash : ${buildHash}`);
    }
  }
}

export default defineConfig({
  // C'est ICI la magie : On donne 2 infos à l'app
  define: {
    // 1. Pour l'affichage Pro ("v1.1.0")
    '__APP_VERSION__': JSON.stringify(packageJson.version),
    // 2. Pour la détection Technique ("a1b2c3d")
    '__BUILD_HASH__': JSON.stringify(buildHash),
  },
  plugins: [
    react(),
    generateVersionJson(), // Ton plugin qui bosse tout seul
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'KevySpace',
        short_name: 'KevySpace',
        description: 'Plateforme de formation',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // On force le réseau pour le fichier de version
            urlPattern: /\/version\.json/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'version-check',
              expiration: { maxEntries: 1, maxAgeSeconds: 0 }
            }
          }
        ]
      }
    })
  ],
})