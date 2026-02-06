// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// --- 1. RÉCUPÉRATION AUTOMATIQUE DU HASH GIT ---
const getGitHash = () => {
  try {
    // Si on est sur Render, ils fournissent le commit via variable d'env
    if (process.env.RENDER_GIT_COMMIT) {
      return process.env.RENDER_GIT_COMMIT.trim();
    }
    // Sinon (en local), on demande à Git
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.warn("⚠️ Impossible de lire le hash git, utilisation timestamp.");
    return Date.now().toString(); // Fallback
  }
};

const appVersion = getGitHash();

// --- 2. PLUGIN POUR GÉNÉRER version.json AUTOMATIQUEMENT ---
const generateVersionJson = () => {
  return {
    name: 'generate-version-json',
    writeBundle() {
      // On écrit le fichier directement dans le dossier de sortie (dist)
      const versionData = { version: appVersion };
      const outputPath = path.resolve(__dirname, 'dist', 'version.json');
      
      // Sécurité : on s'assure que 'dist' existe (parfois Vite le vide)
      if (!fs.existsSync(path.resolve(__dirname, 'dist'))) {
        fs.mkdirSync(path.resolve(__dirname, 'dist'));
      }
      
      fs.writeFileSync(outputPath, JSON.stringify(versionData));
      console.log(`✅ [Auto-Update] version.json généré : ${appVersion}`);
    }
  }
}

export default defineConfig({
  // On rend la version accessible partout dans le code JS
  define: {
    '__APP_VERSION__': JSON.stringify(appVersion),
  },
  plugins: [
    react(),
    generateVersionJson(), // Notre plugin maison
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
        // Important pour ne pas mettre en cache le fichier de version
        runtimeCaching: [
          {
            urlPattern: /\/version\.json/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'version-check',
              expiration: { maxEntries: 1, maxAgeSeconds: 0 } // 0 seconde de cache
            }
          }
        ]
      }
    })
  ],
})