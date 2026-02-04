import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDanger = false, confirmText = "Confirmer" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          backgroundColor: '#FFF', width: '100%', maxWidth: '340px',
          borderRadius: '24px', padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}
      >
        {/* ICÔNE */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          backgroundColor: isDanger ? '#FFE5E5' : '#E5F9E5',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
        }}>
          <AlertTriangle size={32} color={isDanger ? '#FF3B30' : '#34C759'} />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.4' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          {/* Bouton Annuler (Gris) */}
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
              backgroundColor: '#F2F2F7', color: '#000', fontWeight: '600',
              cursor: 'pointer', fontSize: '16px'
            }}
          >
            Annuler
          </button>

          {/* Bouton Confirmer (Rouge ou Vert) */}
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
              backgroundColor: isDanger ? '#FF3B30' : '#34C759', 
              color: '#FFF', fontWeight: '600',
              cursor: 'pointer', fontSize: '16px',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            {confirmText}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default ConfirmModal;