// src/hooks/useAutoUpdate.js
import { useState, useEffect } from 'react';

// On vérifie souvent (ex: toutes les 30 secondes) car c'est léger
const CHECK_INTERVAL = 30 * 1000; 

export const useAutoUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Récupéré depuis vite.config.js (le Hash Git du build actuel)
    // eslint-disable-next-line no-undef
    const localHash = __APP_VERSION__;

    const checkVersion = async () => {
      try {
        // On ajoute ?t=... pour être sûr de ne jamais lire le cache
        const res = await fetch(`/version.json?t=${Date.now()}`);
        
        if (res.ok) {
          const remoteData = await res.json();
          const remoteHash = remoteData.version;

          // Si les Hashs sont différents, c'est qu'il y a eu un nouveau déploiement Git
          if (remoteHash && remoteHash !== localHash) {
            console.log(`🚀 Update Git détecté ! Local: ${localHash} -> Remote: ${remoteHash}`);
            setUpdateAvailable(true);
          }
        }
      } catch (err) {
        // Silence en cas d'erreur réseau
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const reloadPage = () => {
    // Force le rechargement serveur
    window.location.reload(true);
  };

  return { updateAvailable, reloadPage };
};