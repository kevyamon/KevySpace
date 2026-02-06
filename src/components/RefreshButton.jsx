// src/components/RefreshButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const RefreshButton = ({ onClick, refreshing, disabled }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={refreshing || disabled}
      style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: (refreshing || disabled) ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px var(--shadow-color)'
      }}
    >
      <motion.div
        animate={{ rotate: refreshing ? 360 : 0 }}
        transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
      >
        <RefreshCw size={20} color="var(--color-text-main)" />
      </motion.div>
    </motion.button>
  );
};

export default RefreshButton;