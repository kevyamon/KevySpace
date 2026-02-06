// src/context/UpdateContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from 'react-hot-toast';

const UpdateContext = createContext();

// Vérification toutes les 2 minutes
const CHECK_INTERVAL = 2 * 60 * 1000;

export const UpdateProvider = ({ children }) => {
  const [updateStatus, setUpdateStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);

  // Variables injectées par Vite
  // eslint-disable-next-line no-undef
  const displayVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';
  // eslint-disable-next-line no-undef
  const localHash = typeof __BUILD_HASH__ !== 'undefined' ? __BUILD_HASH__ : 'dev';

  // --- 1. PWA STANDARD ---
  const {
    needRefresh: [needRefreshSW, setNeedRefreshSW],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('Erreur SW:', error);
    },
  });

  // --- 2. DÉTECTION GIT (HASH) ---
  const checkForGitUpdate = async (manual = false) => {
    try {
      // On ajoute un timestamp pour éviter le cache navigateur sur le fichier JSON
      const res = await fetch(`/version.json?t=${Date.now()}`);
      if (res.ok) {
        const remoteData = await res.json();
        const remoteHash = remoteData.version;

        // Si le hash serveur est différent du hash local
        if (remoteHash && remoteHash !== localHash) {
          console.log(`🚀 Update détecté: ${remoteHash} (Local: ${localHash})`);
          return true;
        }
      }
    } catch (err) {
      // Erreur silencieuse en background
    }
    
    // Feedback uniquement si l'utilisateur a cliqué sur le bouton
    if (manual) {
      if (updateStatus === 'waiting') {
        // Si une maj est déjà en attente, on ne dit pas qu'il est à jour, on réouvre le modal
        setUpdateStatus('available');
      } else {
        toast.success(`Vous êtes à jour (v${displayVersion})`, { icon: '🛡️' });
      }
    }
    return false;
  };

  // --- SYNC AUTOMATIQUE ---
  useEffect(() => {
    const autoCheck = async () => {
      // On vérifie si on n'est pas déjà en train d'installer pour éviter les conflits
      if (updateStatus === 'installing') return;

      const gitUpdate = await checkForGitUpdate();
      
      if (needRefreshSW || gitUpdate) {
        // Si l'utilisateur n'a pas mis en "Attente" ("Plus tard"), on affiche
        if (updateStatus !== 'waiting') {
          setUpdateStatus('available');
        }
      }
    };

    autoCheck();
    const interval = setInterval(autoCheck, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [needRefreshSW, updateStatus]);

  // --- ACTION : INSTALLATION ROBUSTE (ANTI-BOUCLE) ---
  const installUpdate = () => {
    setUpdateStatus('installing');
    setProgress(0);

    // Simulation Jauge de chargement (Patience)
    let p = 0;
    const interval = setInterval(async () => {
      p += 5;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        
        // --- MOMENT DE VÉRITÉ ---
        
        if (needRefreshSW) {
          // Cas 1 : C'est le Service Worker qui a trouvé la maj
          // On lui dit simplement de s'activer. Il gérera le reload.
          updateServiceWorker(true);
        } else {
          // Cas 2 : C'est notre détection Git manuelle
          // 🚨 C'est ICI que ça bouclait. On applique la méthode "Nucléaire".
          
          try {
            // A. On tue le Service Worker existant pour qu'il arrête de servir le vieux cache
            if ('serviceWorker' in navigator) {
              const registrations = await navigator.serviceWorker.getRegistrations();
              for (const registration of registrations) {
                await registration.unregister();
              }
            }
            
            // B. On vide les caches de fichiers (juste pour être sûr)
            if ('caches' in window) {
              const keys = await caches.keys();
              for (const key of keys) {
                await caches.delete(key);
              }
            }
          } catch (e) {
            console.error("Erreur nettoyage cache:", e);
          }

          // C. Rechargement Brutal (Force le serveur à renvoyer index.html)
          window.location.reload(true);
        }
      }
    }, 50); // ~1 seconde de jauge
  };

  // --- ACTION : PLUS TARD ---
  const dismissUpdate = () => {
    setUpdateStatus('waiting');
    toast('Mise à jour mise en attente.', { icon: '⏳' });
  };

  // --- ACTION : CHECK MANUEL (MENU) ---
  const triggerManualCheck = async () => {
    // Si on est déjà en attente, on force la réapparition
    if (updateStatus === 'waiting') {
      setUpdateStatus('available');
      return;
    }
    
    const gitUpdate = await checkForGitUpdate(true); // true = affiche toast
    if (needRefreshSW || gitUpdate) {
      setUpdateStatus('available');
    }
  };

  return (
    <UpdateContext.Provider value={{ 
      updateStatus, 
      progress, 
      currentVersion: displayVersion, 
      installUpdate, 
      dismissUpdate, 
      triggerManualCheck 
    }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);