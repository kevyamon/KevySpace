// src/components/RefreshButton.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const RefreshButton = ({ onClick, refreshing, disabled }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={refreshing || disabled}
      style={{
        position: 'relative',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px', // Rectangulaire avec bords adoucis
        padding: '0 16px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: (refreshing || disabled) ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px var(--shadow-color)',
        overflow: 'hidden', // Pour contenir la jauge
        minWidth: '120px' // Largeur minimale pour le texte
      }}
    >
      {/* Jauge de progression en arrière-plan */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: Infinity // Boucle tant que ça charge
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              background: 'var(--color-text-secondary)', // Ou une couleur d'accentuation
              opacity: 0.1, // Transparence pour ne pas masquer le texte
              zIndex: 0
            }}
          />
        )}
      </AnimatePresence>

      {/* Contenu au premier plan */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <motion.div
            animate={{ rotate: refreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
        >
            <RefreshCw size={16} color="var(--color-text-main)" />
        </motion.div>
        
        <span style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'var(--color-text-main)' 
        }}>
            {refreshing ? 'Chargement...' : 'Actualiser'}
        </span>
      </div>
    </motion.button>
  );
};

export default RefreshButton;