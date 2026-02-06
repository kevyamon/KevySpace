// src/components/UpdateNotification.jsx
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Zap } from 'lucide-react';
import { useAutoUpdate } from '../hooks/useAutoUpdate'; // Import du hook

const UpdateNotification = () => {
  // 1. Détection PWA standard
  const {
    needRefresh: [needRefreshSW, setNeedRefreshSW],
    updateServiceWorker,
  } = useRegisterSW();

  // 2. Détection Git automatique
  const { updateAvailable: gitUpdateAvailable, reloadPage } = useAutoUpdate();

  // Si l'un des deux dit "Update", on affiche !
  const hasUpdate = needRefreshSW || gitUpdateAvailable;

  const handleUpdate = () => {
    if (needRefreshSW) {
      updateServiceWorker(true);
    } else {
      reloadPage();
    }
  };

  return (
    <AnimatePresence>
      {hasUpdate && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'relative', backgroundColor: '#FFF',
              width: '100%', maxWidth: '400px',
              borderRadius: '24px', padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
            }}
          >
            <div style={{
              width: '64px', height: '64px', backgroundColor: '#FFF8E1',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                <RefreshCw size={32} color="#FFD700" strokeWidth={2.5} />
              </motion.div>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1D1D1F', marginBottom: '8px' }}>
                Nouvelle version dispo !
              </h2>
              <p style={{ fontSize: '15px', color: '#86868B', lineHeight: '1.5' }}>
                Une mise à jour a été détectée (Nouveau Commit). Installez-la pour continuer.
              </p>
            </div>

            <motion.button
              onClick={handleUpdate}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
              style={{
                marginTop: '12px', width: '100%', backgroundColor: '#1D1D1F', color: '#FFF',
                border: 'none', padding: '16px', borderRadius: '16px',
                fontSize: '16px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              <Zap size={20} fill="#FFF" />
              Mettre à jour
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;