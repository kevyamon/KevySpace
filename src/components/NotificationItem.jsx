// src/components/NotificationItem.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Info, AlertTriangle, CheckCircle, 
  Trash2, Archive, ChevronDown, ChevronUp 
} from 'lucide-react';

const NotificationItem = ({ notification, onDelete, onArchive, onRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Choix de l'icône selon le type
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle size={20} color="#34C759" />;
      case 'warning': return <AlertTriangle size={20} color="#FF9500" />;
      case 'info': return <Info size={20} color="#007AFF" />;
      default: return <Bell size={20} color="#FFD700" />;
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!notification.read && onRead) {
      onRead(notification.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      style={{
        backgroundColor: '#FFF',
        borderRadius: '20px',
        marginBottom: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        border: notification.read ? '1px solid transparent' : '1px solid var(--color-gold)', // Bordure dorée si non lu
        overflow: 'hidden'
      }}
    >
      {/* HEADER (Toujours visible) */}
      <div 
        onClick={toggleExpand}
        style={{ 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px',
          cursor: 'pointer'
        }}
      >
        {/* Indicateur Non-lu */}
        {!notification.read && (
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', 
            backgroundColor: '#FF3B30', flexShrink: 0
          }} />
        )}

        {/* Icone */}
        <div style={{ 
          background: '#F5F5F7', padding: '10px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {getIcon()}
        </div>

        {/* Textes Principaux */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '15px', fontWeight: notification.read ? '600' : '800', 
            color: '#1D1D1F', marginBottom: '4px' 
          }}>
            {notification.title}
          </h3>
          <p style={{ fontSize: '12px', color: '#86868B' }}>
            {notification.time}
          </p>
        </div>

        {/* Chevron */}
        {isExpanded ? <ChevronUp size={18} color="#C7C7CC" /> : <ChevronDown size={18} color="#C7C7CC" />}
      </div>

      {/* BODY (Extensible) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 16px 16px' }}>
              
              {/* Description complète */}
              <p style={{ 
                fontSize: '14px', color: '#444', lineHeight: '1.5', 
                backgroundColor: '#F9F9F9', padding: '12px', borderRadius: '12px',
                marginBottom: '16px'
              }}>
                {notification.description}
              </p>

              {/* Barre d'actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); onArchive(notification.id); }}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                    backgroundColor: '#E5E5EA', color: '#1D1D1F', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Archive size={16} />
                  Archiver
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                    backgroundColor: '#FFE5E5', color: '#FF3B30', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationItem;