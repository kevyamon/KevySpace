import { useState, useEffect } from 'react';

// Intervalle de vérification (ex: toutes les 60 secondes)
const CHECK_INTERVAL = 60 * 1000; 

export const useAutoUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // La version actuelle injectée au moment du Build (voir vite.config.js)
    // Note: Vite remplace __APP_VERSION__ par la string réelle
    const currentVersion = __APP_VERSION__;

    const checkVersion = async () => {
      try {
        // Cache Busting : on ajoute ?t=timestamp pour forcer le navigateur à ne pas utiliser le cache
        const res = await fetch(`/version.json?t=${Date.now()}`);
        
        if (res.ok) {
          const remoteData = await res.json();
          const remoteVersion = remoteData.version;

          // Comparaison : Si le hash du serveur est différent du hash local
          if (remoteVersion && remoteVersion !== currentVersion) {
            console.log(`🚀 Nouvelle version détectée : ${remoteVersion} (Actuelle: ${currentVersion})`);
            setUpdateAvailable(true);
          }
        }
      } catch (err) {
        console.error("Erreur vérification maj:", err);
      }
    };

    // 1. Vérification initiale
    // checkVersion(); // Optionnel : vérifier dès le chargement

    // 2. Polling régulier
    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const reloadPage = () => {
    // Rechargement dur pour purger le cache JS
    window.location.reload(true);
  };

  return { updateAvailable, reloadPage };
};