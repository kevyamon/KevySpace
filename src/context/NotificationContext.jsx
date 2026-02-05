// frontend/src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  
  // CLE DE SAUVEGARDE (J'ai changé le nom pour forcer le nettoyage des vieilles données)
  const STORAGE_KEY = 'kevy_notifications_live';

  // 1. INITIALISATION PROPRE
  const [notifications, setNotifications] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : []; // Si rien, tableau vide !
    } catch (error) {
      console.error("Erreur lecture notifs", error);
      return [];
    }
  });

  // 2. SAUVEGARDE AUTOMATIQUE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

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