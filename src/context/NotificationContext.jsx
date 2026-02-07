// frontend/src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  
  const STORAGE_KEY = 'kevy_notifications_live';
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error("Erreur lecture notifs", error);
      return [];
    }
  });

  // SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // =====================
  // SOCKET IO — ÉCOUTE TEMPS RÉEL DES NOTIFICATIONS
  // =====================
  useEffect(() => {
    if (!user) return;

    const socket = io('https://kevyspace-backend.onrender.com');
    const myId = String(user._id || user.id);

    const handleNewNotification = (payload) => {
      // Vérifier que cette notification est pour MOI
      if (payload.targetUserId !== myId) return;

      const notif = payload.notification;

      // Construire la notification au format du context
      const newNotif = {
        id: notif._id || Date.now(),
        title: notif.title,
        description: notif.message,
        type: notif.type || 'info',
        link: notif.link || null,
        time: formatTimeAgo(notif.createdAt),
        read: false
      };

      // Éviter les doublons
      setNotifications(prev => {
        const exists = prev.some(n => 
          String(n.id) === String(newNotif.id) || 
          (n.title === newNotif.title && n.description === newNotif.description && !n.read)
        );
        if (exists) return prev;
        return [newNotif, ...prev];
      });
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
      socket.disconnect();
    };
  }, [user]);

  // CALCUL DYNAMIQUE
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- ACTIONS ---

  const addNotification = (notif) => {
    const newNotif = {
        id: Date.now(), 
        time: "À l'instant",
        read: false,
        ...notif 
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const archiveNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const resetNotifications = () => {
    localStorage.removeItem(STORAGE_KEY);
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification,
      archiveNotification,
      resetNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// --- UTILITAIRE ---
const formatTimeAgo = (dateString) => {
  if (!dateString) return "À l'instant";

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString();
};