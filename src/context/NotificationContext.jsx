// frontend/src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  
  // 1. INITIALISATION (VIDE PAR DÉFAUT)
  // On ne charge que ce qu'il y a dans le localStorage, sinon liste vide []
  const [notifications, setNotifications] = useState(() => {
    const savedData = localStorage.getItem('kevy_notifications');
    return savedData ? JSON.parse(savedData) : []; 
  });

  // 2. SAUVEGARDE AUTOMATIQUE
  // À chaque fois que 'notifications' change (lu, supprimé...), on sauvegarde dans le navigateur
  useEffect(() => {
    localStorage.setItem('kevy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // CALCUL DYNAMIQUE
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- ACTIONS ---

  // NOUVELLE FONCTION : Ajouter une notification
  const addNotification = (notif) => {
    const newNotif = {
        id: Date.now(), // ID unique basé sur le temps
        time: "À l'instant", // Par défaut
        read: false,
        ...notif // On écrase avec les données fournies (title, description, type)
    };
    // On ajoute au début de la liste (le plus récent en haut)
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

  // Fonction bonus pour réinitialiser
  const resetNotifications = () => {
    localStorage.removeItem('kevy_notifications');
    setNotifications([]); // On vide l'état local aussi
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, // <--- On expose la nouvelle fonction
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