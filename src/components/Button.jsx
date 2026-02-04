// src/components/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', // 'primary' (Jaune) ou 'secondary' (Gris) ou 'danger' (Rouge)
  isLoading = false, 
  type = 'button',
  fullWidth = false 
}) => {
  
  // Styles dynamiques selon la variante
  const getStyle = () => {
    const base = {
      padding: '16px 24px',
      borderRadius: 'var(--radius-l)', // Arrondi iOS
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: fullWidth ? '100%' : 'auto',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: 'var(--color-gold)', color: '#000' };
      case 'secondary':
        return { ...base, backgroundColor: '#E5E5EA', color: '#000' }; // Gris Apple
      case 'outline':
        return { ...base, backgroundColor: 'transparent', border: '2px solid var(--color-gold)', color: 'var(--color-text-main)' };
      case 'danger':
        return { ...base, backgroundColor: 'var(--color-danger)', color: '#fff' };
      default:
        return base;
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      style={getStyle()}
      disabled={isLoading}
      whileTap={{ scale: 0.96 }} // Effet "presse" iOS quand on clique
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isLoading && <Loader2 className="animate-spin" size={20} />}
      {children}
    </motion.button>
  );
};

export default Button;