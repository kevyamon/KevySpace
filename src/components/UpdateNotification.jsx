// src/components/UpdateNotification.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DownloadCloud, X, Code2 } from 'lucide-react';
import { useUpdate } from '../context/UpdateContext';

const UpdateNotification = () => {
  const { updateStatus, progress, currentVersion, installUpdate, dismissUpdate } = useUpdate();

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
                position: 'relative',
                width: '72px', height: '72px',
                margin: '0 auto 20px auto',
              }}>
                {/* JAUGE CIRCULAIRE DE PROGRESSION */}
                {updateStatus === 'installing' && (
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '72px',
                      height: '72px',
                      transform: 'rotate(-90deg)'
                    }}
                  >
                    {/* Cercle de fond */}
                    <circle
                      cx="36"
                      cy="36"
                      r="34"
                      fill="none"
                      stroke="#F0F0F0"
                      strokeWidth="2"
                    />
                    {/* Cercle de progression */}
                    <circle
                      cx="36"
                      cy="36"
                      r="34"
                      fill="none"
                      stroke="#1D1D1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                    />
                  </svg>
                )}
                
                {/* ICÔNE AU CENTRE */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#F5F5F7',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                  zIndex: 1
                }}>
                  <DownloadCloud 
                    size={32} 
                    color="#1D1D1F" 
                    style={{ opacity: updateStatus === 'installing' ? 0.7 : 1 }}
                  />
                </div>
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

            {/* JAUGE DE PROGRESSION LINÉAIRE (Visible uniquement si installing) */}
            {updateStatus === 'installing' && (
              <div style={{ padding: '0 32px 40px 32px' }}>
                <div style={{ 
                  position: 'relative',
                  height: '6px', 
                  background: '#F0F0F0', 
                  borderRadius: '10px', 
                  overflow: 'hidden' 
                }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%', 
                      background: '#1D1D1F',
                      borderRadius: '10px'
                    }}
                  />
                </div>
                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  color: '#1D1D1F', 
                  marginTop: '10px', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}>
                  <span style={{ 
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1D1D1F',
                    animation: 'pulse 1.5s infinite'
                  }}></span>
                  {progress}% complété
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

          {/* Style CSS pour l'animation de pulse */}
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;