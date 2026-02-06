// src/components/ThemeToggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      style={{
        background: theme === 'light' ? '#E5E5EA' : '#2C2C2E',
        border: 'none',
        borderRadius: '50%',
        width: '40px', height: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        color: theme === 'light' ? '#000' : '#FFD700', // Lune dorée la nuit
        boxShadow: '0 2px 8px var(--shadow-color)',
        transition: 'all 0.3s ease'
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
      >
        {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;