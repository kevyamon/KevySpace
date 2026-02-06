// src/components/UpdateNotification.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, DownloadCloud, X, Code2 } from 'lucide-react';
import { useUpdate } from '../context/UpdateContext'; // On utilise le Context

const UpdateNotification = () => {
  const { updateStatus, progress, currentVersion, installUpdate, dismissUpdate } = useUpdate();

  // On affiche SI 'available' OU 'installing'
  const isVisible = updateStatus === 'available' || updateStatus === 'installing';

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          
          {/* FOND FLOU */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)',
            }}
          />

          {/* LA CARTE PRO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            style={{
              position: 'relative', backgroundColor: '#FFF',
              width: '100%', maxWidth: '380px',
              borderRadius: '28px', padding: '0', overflow: 'hidden',
              boxShadow: '0 40px 80px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            
            {/* HEADER DESIGN */}
            <div style={{ padding: '32px 32px 20px 32px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', backgroundColor: '#F5F5F7',
                borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px auto', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
              }}>
                {updateStatus === 'installing' ? (
                   <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <RefreshCw size={32} color="#1D1D1F" />
                   </motion.div>
                ) : (
                   <DownloadCloud size={32} color="#1D1D1F" />
                )}
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F', marginBottom: '8px' }}>
                {updateStatus === 'installing' ? 'Installation en cours...' : 'Nouvelle version disponible'}
              </h2>
              
              <p style={{ fontSize: '14px', color: '#86868B', lineHeight: '1.5' }}>
                {updateStatus === 'installing' 
                  ? 'Optimisation des fichiers pour une expérience fluide.' 
                  : 'Une mise à jour importante est prête à être installée.'}
              </p>

              {/* VERSION & DEV INFO */}
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                 <div style={{ background: '#F5F5F7', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#1D1D1F' }}>
                    v{currentVersion} → New
                 </div>
                 <div style={{ background: '#F5F5F7', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#86868B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Code2 size={10} /> Developper: Kevy LLC
                 </div>
              </div>
            </div>

            {/* JAUGE DE PROGRESSION (Visible uniquement si installing) */}
            {updateStatus === 'installing' && (
              <div style={{ padding: '0 32px 40px 32px' }}>
                <div style={{ height: '6px', background: '#F0F0F0', borderRadius: '10px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: '#1D1D1F' }}
                  />
                </div>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#AAA', marginTop: '10px', fontWeight: '600' }}>
                  {progress}%
                </p>
              </div>
            )}

            {/* BOUTONS (Cachés pendant l'installation pour éviter les clics) */}
            {updateStatus !== 'installing' && (
              <div style={{ padding: '0 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.button
                  onClick={installUpdate}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '18px',
                    backgroundColor: '#1D1D1F', color: '#FFF', border: 'none',
                    fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                  }}
                >
                  Installer et Redémarrer
                </motion.button>

                <button
                  onClick={dismissUpdate}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '18px',
                    backgroundColor: 'transparent', color: '#86868B', border: 'none',
                    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  }}
                >
                  Plus tard
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;