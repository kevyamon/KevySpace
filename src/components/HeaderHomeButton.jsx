// src/components/HeaderHomeButton.jsx
import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeaderHomeButton = ({ size = 24, color = "#1D1D1F" }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/')} // Redirige intelligemment vers l'accueil (Admin ou User)
      style={{
        background: 'transparent',
        border: 'none',
        padding: '0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px', // Une zone de clic confortable
        height: '32px'
      }}
      title="Retour à l'accueil"
    >
      <Home size={size} color={color} strokeWidth={2.5} />
    </motion.button>
  );
};

export default HeaderHomeButton;