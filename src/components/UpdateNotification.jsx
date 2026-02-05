import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Download } from 'lucide-react';
import { useAutoUpdate } from '../hooks/useAutoUpdate';

const UpdateNotification = () => {
  // On branche le cerveau (Le Hook)
  const { updateAvailable, reloadPage } = useAutoUpdate();

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px', // En bas à droite (discret mais visible)
            zIndex: 99999, // Au-dessus de TOUT (y compris Sidebar/Modal)
            backgroundColor: '#1D1D1F',
            color: '#FFF',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            maxWidth: '90vw'
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Download size={20} color="var(--color-gold)" />
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>Mise à jour disponible</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#86868B' }}>Une nouvelle version est prête.</p>
          </div>

          <button
            onClick={reloadPage}
            style={{
              backgroundColor: 'var(--color-gold)',
              color: '#FFF',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '13px'
            }}
          >
            <RefreshCw size={14} />
            Rafraîchir
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;