// src/pages/Notifications.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from '../components/NotificationItem';
import { NotificationContext } from '../context/NotificationContext';

const Notifications = () => {
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    markAsRead, 
    deleteNotification, 
    archiveNotification 
  } = useContext(NotificationContext);

  const handleNotificationClick = (notif) => {
    // Marquer comme lue
    if (!notif.read) {
      markAsRead(notif.id);
    }
    // Naviguer vers le lien si disponible
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div style={{ 
      padding: '20px 16px', 
      minHeight: '100%', 
      display: 'flex', flexDirection: 'column' 
    }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <ArrowLeft size={24} color="var(--color-gold)" />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-gold)' }}>Notifications</h1>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            style={{ 
              fontSize: '13px', fontWeight: '700', color: 'var(--color-gold)',
              background: 'rgba(255, 215, 0, 0.15)', 
              border: '1px solid rgba(255, 215, 0, 0.25)',
              cursor: 'pointer',
              padding: '8px 12px', borderRadius: '12px',
              transition: 'all 0.2s ease'
            }}
          >
            Tout lire
          </button>
        )}
      </div>

      {/* LISTE DES NOTIFICATIONS */}
      <div style={{ flex: 1 }}>
        {notifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              marginTop: '80px', textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 215, 0, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid rgba(255, 215, 0, 0.2)'
            }}>
              <BellOff size={36} color="rgba(255, 215, 0, 0.5)" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-on-bg-secondary)' }}>
              Aucune notification
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(245, 243, 240, 0.6)', lineHeight: '1.5', maxWidth: '280px' }}>
              Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif) => (
              <NotificationItem 
                key={notif.id} 
                notification={notif}
                onDelete={deleteNotification}
                onArchive={archiveNotification}
                onRead={markAsRead}
                onClick={() => handleNotificationClick(notif)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
};

export default Notifications;