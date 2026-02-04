// src/components/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  isLoading = false, 
  type = 'button',
  fullWidth = false,
  pulse = false // NOUVELLE PROP : Active l'effet respiration
}) => {
  
  // Styles dynamiques
  const getStyle = () => {
    const base = {
      padding: '16px 24px',
      borderRadius: 'var(--radius-l)',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      transition: 'background-color 0.2s ease, color 0.2s ease', // On laisse Framer gérer le scale
    };

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: 'var(--color-gold)', color: '#000' };
      case 'secondary':
        return { ...base, backgroundColor: '#E5E5EA', color: '#000' };
      case 'outline':
        return { ...base, backgroundColor: 'transparent', border: '2px solid var(--color-gold)', color: 'var(--color-text-main)' };
      case 'danger':
        return { ...base, backgroundColor: 'var(--color-danger)', color: '#fff' };
      default:
        return base;
    }
  };

  // Configuration de l'animation de respiration
  const breathingAnimation = {
    scale: [1, 1.03, 1], // Zoom très léger (3%)
    boxShadow: [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 4px 12px rgba(255, 215, 0, 0.4)", // Lueur dorée subtile au pic
      "0px 0px 0px rgba(0,0,0,0)"
    ]
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      style={getStyle()}
      disabled={isLoading}
      
      // ANIMATION D'ENTRÉE + RESPIRATION (Si demandée)
      initial={{ opacity: 0, y: 10 }}
      animate={
        pulse && !isLoading
          ? { opacity: 1, y: 0, ...breathingAnimation } // Entrée + Respiration
          : { opacity: 1, y: 0 } // Juste l'entrée
      }
      transition={
        pulse && !isLoading
          ? { 
              opacity: { duration: 0.3 }, 
              y: { duration: 0.3 },
              scale: { 
                duration: 2, // Cycle lent de 2 secondes
                repeat: Infinity, 
                ease: "easeInOut" 
              },
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          : { duration: 0.3 }
      }
      
      whileTap={{ scale: 0.96 }} // Le "clic" reste prioritaire
    >
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      {children}
    </motion.button>
  );
};

export default Button;