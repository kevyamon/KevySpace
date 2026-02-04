// src/pages/Notifications.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from '../components/NotificationItem';
import { NotificationContext } from '../context/NotificationContext'; // C'est ici que sont tes lignes manquantes !

const Notifications = () => {
  const navigate = useNavigate();
  
  // On récupère la logique depuis le "Cerveau Central" (Context)
  // C'est ça qui remplace tes 40 lignes de fonctions locales (handleDelete, etc.)
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead, 
    markAsRead, 
    deleteNotification, 
    archiveNotification 
  } = useContext(NotificationContext);

  return (
    <div style={{ 
      padding: '20px', 
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
            <ArrowLeft size={24} color="#1D1D1F" />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Notifications</h1>
        </div>
        
        {/* BOUTON "TOUT LIRE" - Lié au Context */}
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            style={{ 
              fontSize: '13px', fontWeight: '700', color: 'var(--color-gold)',
              background: '#FFFBF0', border: 'none', cursor: 'pointer',
              padding: '8px 12px', borderRadius: '12px'
            }}
          >
            Tout lire
          </button>
        )}
      </div>

      {/* LISTE DES NOTIFICATIONS */}
      <div style={{ flex: 1 }}>
        {notifications.length === 0 ? (
          // ETAT VIDE
          <div style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            marginTop: '100px', gap: '16px', opacity: 0.5
          }}>
            <BellOff size={48} color="#000" />
            <p style={{ fontWeight: '500' }}>Aucune notification</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif) => (
              <NotificationItem 
                key={notif.id} 
                notification={notif}
                onDelete={deleteNotification}
                onArchive={archiveNotification}
                onRead={markAsRead}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
};

export default Notifications;