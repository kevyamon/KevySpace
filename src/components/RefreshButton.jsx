// src/components/RefreshButton.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RefreshButton = ({ onClick, refreshing, disabled }) => {
  const [progress, setProgress] = useState(0);

  // Gestion de la progression de la jauge
  useEffect(() => {
    let animationFrame;
    let startTime;
    
    if (refreshing) {
      setProgress(0);
      startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        // Animation de 2 secondes pour remplir complètement
        const newProgress = Math.min(elapsed / 2000, 1);
        setProgress(newProgress);
        
        if (newProgress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
    } else {
      setProgress(0);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [refreshing]);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={refreshing || disabled}
      style={{
        position: 'relative',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '0 16px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: (refreshing || disabled) ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px var(--shadow-color)',
        overflow: 'hidden',
        minWidth: '120px',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Jauge de progression en arrière-plan */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress * 100}%` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              background: 'var(--color-text-secondary)',
              opacity: 0.1,
              zIndex: 0
            }}
          />
        )}
      </AnimatePresence>

      {/* Contenu au premier plan */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%'
      }}>
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: 'var(--color-text-main)',
          whiteSpace: 'nowrap'
        }}>
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </span>
        
        {/* Indicateur visuel minimal pendant le rafraîchissement */}
        {refreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--color-text-main)',
              marginLeft: '8px',
              animation: 'pulse 1.5s infinite'
            }}
          />
        )}
      </div>

      {/* Style CSS pour l'animation de pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </motion.button>
  );
};

export default RefreshButton;