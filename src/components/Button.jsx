// src/components/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', // <--- NOUVELLE PROP (small, medium, large)
  isLoading = false, 
  type = 'button',
  fullWidth = false,
  pulse = false 
}) => {
  
  // Gestion des tailles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { padding: '10px 16px', fontSize: '14px' }; // Plus compact
      case 'large':
        return { padding: '20px 32px', fontSize: '18px' };
      case 'medium':
      default:
        return { padding: '16px 24px', fontSize: '16px' }; // Taille standard actuelle
    }
  };

  const getStyle = () => {
    const sizeStyle = getSizeStyle();
    
    const base = {
      ...sizeStyle, // On applique la taille choisie
      borderRadius: 'var(--radius-l)',
      fontWeight: '600',
      border: 'none',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      transition: 'background-color 0.2s ease, color 0.2s ease', 
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

  const breathingAnimation = {
    scale: [1, 1.03, 1], 
    boxShadow: [
      "0px 0px 0px rgba(0,0,0,0)",
      "0px 4px 12px rgba(255, 215, 0, 0.4)", 
      "0px 0px 0px rgba(0,0,0,0)"
    ]
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      style={getStyle()}
      disabled={isLoading}
      initial={{ opacity: 0, y: 10 }}
      animate={pulse && !isLoading ? { opacity: 1, y: 0, ...breathingAnimation } : { opacity: 1, y: 0 }}
      transition={
        pulse && !isLoading
          ? { 
              opacity: { duration: 0.3 }, 
              y: { duration: 0.3 },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          : { duration: 0.3 }
      }
      whileTap={{ scale: 0.96 }} 
    >
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      {children}
    </motion.button>
  );
};

export default Button;