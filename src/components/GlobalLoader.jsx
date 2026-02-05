// src/components/GlobalLoader.jsx
import React from 'react';
import { Loader } from 'lucide-react';

const GlobalLoader = ({ text = "Chargement..." }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#FAFAFA', // Fond très clair et propre
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 999999 // Toujours au-dessus de tout
    }}>
      
      {/* L'ANIMATION */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Cercle décoratif en arrière plan (optionnel, donne du volume) */}
        <div style={{
          position: 'absolute',
          width: '60px', height: '60px',
          borderRadius: '50%',
          border: '4px solid rgba(0,0,0,0.05)',
        }}></div>

        {/* L'icône qui tourne */}
        <Loader 
          size={48} 
          color="#FFD700" // Couleur OR (Ta couleur de marque)
          className="global-spin" 
          strokeWidth={2.5}
        />
      </div>

      {/* TEXTE (Optionnel) */}
      <p style={{ 
        marginTop: '24px', 
        fontSize: '14px', 
        fontWeight: '600', 
        color: '#86868B',
        letterSpacing: '0.5px',
        animation: 'pulse 2s infinite'
      }}>
        {text}
      </p>

      {/* STYLES CSS INTÉGRÉS */}
      <style>{`
        .global-spin { 
          animation: spin 1s linear infinite; 
        }
        
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;