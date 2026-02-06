// src/components/OfflineModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineModal = ({ isOffline }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          />

          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            style={{
              position: 'relative',
              background: 'var(--bg-surface)',
              borderRadius: '24px',
              padding: '32px 24px',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-color)'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255, 59, 48, 0.4)'
              }}
            >
              <WifiOff size={40} color="#FFF" />
            </motion.div>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--color-text-main)',
              marginBottom: '12px'
            }}>
              Connexion Internet perdue
            </h2>

            <p style={{
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.5',
              marginBottom: '24px'
            }}>
              Veuillez vérifier votre connexion Internet et actualiser la page pour continuer.
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReload}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: '16px',
                color: '#000',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
              }}
            >
              <RefreshCw size={20} />
              Actualiser
            </motion.button>

            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--color-text-secondary)'
            }}>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FF3B30'
                }}
              />
              En attente de connexion...
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineModal;