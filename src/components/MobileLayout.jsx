// src/components/MobileLayout.jsx
import React from 'react';

const MobileLayout = ({ children }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '100vh', // Assure la hauteur complète
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden', // CRITICAL: Empêche débordement horizontal
      WebkitOverflowScrolling: 'touch', // Scroll fluide iOS
      
      // Safe area pour les téléphones avec encoche
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {children}
    </div>
  );
};

export default MobileLayout;