// src/components/NotificationItem.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Info, AlertTriangle, CheckCircle, 
  Trash2, Archive, ChevronDown, ChevronUp, ExternalLink 
} from 'lucide-react';

const NotificationItem = ({ notification, onDelete, onArchive, onRead, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle size={20} color="#34C759" />;
      case 'warning': return <AlertTriangle size={20} color="#FF9500" />;
      case 'info': return <Info size={20} color="var(--color-gold)" />;
      default: return <Bell size={20} color="var(--color-gold)" />;
    }
  };

  const getAccentColor = () => {
    switch (notification.type) {
      case 'success': return 'rgba(52, 199, 89, 0.15)';
      case 'warning': return 'rgba(255, 149, 0, 0.15)';
      case 'error': return 'rgba(255, 59, 48, 0.15)';
      default: return 'rgba(255, 215, 0, 0.15)';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return 'rgba(52, 199, 89, 0.25)';
      case 'warning': return 'rgba(255, 149, 0, 0.25)';
      case 'error': return 'rgba(255, 59, 48, 0.25)';
      default: return 'rgba(255, 215, 0, 0.2)';
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!notification.read && onRead) {
      onRead(notification.id);
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      style={{
        backgroundColor: notification.read 
          ? 'rgba(255, 255, 255, 0.04)' 
          : getAccentColor(),
        borderRadius: '20px',
        marginBottom: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: notification.read 
          ? '1px solid rgba(255, 215, 0, 0.08)' 
          : `1px solid ${getBorderColor()}`,
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
            backgroundColor: 'var(--color-gold)', flexShrink: 0
          }} />
        )}

        {/* Icone */}
        <div style={{ 
          background: getAccentColor(), 
          padding: '10px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${getBorderColor()}`
        }}>
          {getIcon()}
        </div>

        {/* Textes Principaux */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            fontSize: '15px', fontWeight: notification.read ? '600' : '800', 
            color: 'var(--color-text-on-bg-secondary)', marginBottom: '4px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {notification.title}
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(245, 243, 240, 0.4)' }}>
            {notification.time}
          </p>
        </div>

        {/* Chevron */}
        {isExpanded 
          ? <ChevronUp size={18} color="rgba(245, 243, 240, 0.4)" /> 
          : <ChevronDown size={18} color="rgba(245, 243, 240, 0.4)" />
        }
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
                fontSize: '14px', color: 'var(--color-text-on-bg-secondary)', lineHeight: '1.5', 
                backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                padding: '12px', borderRadius: '12px',
                marginBottom: '16px',
                border: '1px solid rgba(255, 215, 0, 0.08)'
              }}>
                {notification.description || notification.message}
              </p>

              {/* Barre d'actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                
                {/* BOUTON VOIR (Si link disponible) */}
                {notification.link && (
                  <button 
                    onClick={handleNavigate}
                    style={{ 
                      flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                      backgroundColor: 'var(--color-gold)', 
                      color: 'var(--color-bg)', fontWeight: '700',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      cursor: 'pointer', fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    <ExternalLink size={14} />
                    Voir
                  </button>
                )}

                <button 
                  onClick={(e) => { e.stopPropagation(); onArchive(notification.id); }}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '12px', 
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                    color: 'var(--color-text-on-bg-secondary)', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  <Archive size={14} />
                  Archiver
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '12px', 
                    border: '1px solid rgba(255, 59, 48, 0.25)',
                    backgroundColor: 'rgba(255, 59, 48, 0.15)', 
                    color: '#FF3B30', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  <Trash2 size={14} />
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