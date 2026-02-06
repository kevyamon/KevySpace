// src/context/UpdateContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from 'react-hot-toast';

const UpdateContext = createContext();

// Intervalle de vérification automatique (ex: 2 minutes)
const CHECK_INTERVAL = 2 * 60 * 1000;

export const UpdateProvider = ({ children }) => {
  // --- ÉTATS ---
  // 'idle' = rien
  // 'available' = mise à jour prête (affiche le modal)
  // 'waiting' = l'utilisateur a dit "Plus tard"
  // 'installing' = la jauge se remplit
  const [updateStatus, setUpdateStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0); // Pour la jauge 0-100%

  // Récupération de la version (injectée par Vite)
  // eslint-disable-next-line no-undef
  const currentVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

  // --- 1. LOGIQUE PWA (Service Worker) ---
  const {
    needRefresh: [needRefreshSW, setNeedRefreshSW],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // --- 2. LOGIQUE MANUELLE (Git Hash / Version.json) ---
  const checkForGitUpdate = async (manual = false) => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`);
      if (res.ok) {
        const remoteData = await res.json();
        const remoteVersion = remoteData.version;

        if (remoteVersion && remoteVersion !== currentVersion) {
          console.log(`🚀 Update détecté: ${remoteVersion}`);
          return true;
        }
      }
    } catch (err) {
      console.warn("Erreur check version");
    }
    
    if (manual) toast.success("Vous utilisez la dernière version.", { icon: '🛡️' });
    return false;
  };

  // --- SYNC DES DÉTECTIONS ---
  useEffect(() => {
    // Si le SW détecte une maj OU si le check Git en trouve une
    const autoCheck = async () => {
      const gitUpdate = await checkForGitUpdate();
      if (needRefreshSW || gitUpdate) {
        // Si on n'est pas déjà en train d'attendre ("Plus tard"), on affiche
        if (updateStatus !== 'waiting') {
          setUpdateStatus('available');
        }
      }
    };

    autoCheck();
    const interval = setInterval(autoCheck, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [needRefreshSW, updateStatus]);

  // --- ACTIONS ---

  // A. L'utilisateur clique sur "Mettre à jour" (LA JAUGE)
  const installUpdate = () => {
    setUpdateStatus('installing');
    setProgress(0);

    // Simulation d'une installation robuste (pour laisser le temps au SW de s'activer)
    let p = 0;
    const interval = setInterval(() => {
      p += 5; // Incrément
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        // CRUCIAL : C'est ici qu'on applique vraiment
        if (needRefreshSW) {
          updateServiceWorker(true);
        } else {
          // Rechargement brutal pour le mode Git Hash
          window.location.reload(true);
        }
      }
    }, 50); // Durée totale ~1 sec (50ms * 20 étapes)
  };

  // B. L'utilisateur clique sur "Plus tard"
  const dismissUpdate = () => {
    setUpdateStatus('waiting');
    toast('Mise à jour mise en attente.', { icon: '⏳' });
  };

  // C. L'utilisateur clique sur le bouton du Menu (Check manuel)
  const triggerManualCheck = async () => {
    const gitUpdate = await checkForGitUpdate(true); // true = affiche toast si rien
    if (needRefreshSW || gitUpdate) {
      setUpdateStatus('available'); // Force l'affichage même si on était en 'waiting'
    }
  };

  return (
    <UpdateContext.Provider value={{ 
      updateStatus, 
      progress, 
      currentVersion, 
      installUpdate, 
      dismissUpdate, 
      triggerManualCheck 
    }}>
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => useContext(UpdateContext);