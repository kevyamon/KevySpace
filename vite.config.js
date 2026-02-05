import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 1. LIRE LA VERSION DEPUIS PACKAGE.JSON
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const appVersion = packageJson.version; // Ex: "1.0.2"

export default defineConfig(() => {
  // 2. RÉCUPÉRATION DU GIT HASH (Pour l'auto-update technique)
  let commitHash = '';
  try {
    commitHash = execSync('git rev-parse HEAD').toString().trim();
  } catch (e) {
    commitHash = Date.now().toString();
  }

  // CRÉATION DU FICHIER version.json (Pour l'auto-update)
  const versionData = {
    version: commitHash,
    timestamp: Date.now()
  };

  const publicDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  
  fs.writeFileSync(
    path.join(publicDir, 'version.json'),
    JSON.stringify(versionData, null, 2)
  );

  return {
    plugins: [react()],
    // 3. INJECTION DES VARIABLES GLOBALES
    define: {
      // Hash technique pour le système de mise à jour auto
      '__APP_VERSION__': JSON.stringify(commitHash),
      // Version sémantique (1.0.2) pour l'affichage UI
      '__APP_VERSION_DISPLAY__': JSON.stringify(appVersion) 
    },
    server: {
      host: true,
      port: 5173,
    }
  };
});