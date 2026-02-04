// src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  
  // 1. INITIALISATION INTELLIGENTE
  // Au démarrage, on regarde si on a déjà des données sauvegardées
  const [notifications, setNotifications] = useState(() => {
    const savedData = localStorage.getItem('kevy_notifications');
    return savedData ? JSON.parse(savedData) : [
      // DONNÉES PAR DÉFAUT (Si c'est la première visite)
      {
        id: 1,
        type: 'info',
        title: 'Bienvenue sur KevySpace !',
        description: 'Nous sommes ravis de vous compter parmi nous. N\'oubliez pas de compléter votre profil.',
        time: 'Il y a 2 heures',
        read: false 
      },
      {
        id: 2,
        type: 'success',
        title: 'Module 1 validé',
        description: 'Félicitations ! Vous avez terminé le premier module avec succès.',
        time: 'Hier',
        read: true 
      },
      {
        id: 3,
        type: 'warning',
        title: 'Maintenance prévue',
        description: 'Une maintenance des serveurs aura lieu ce soir à minuit.',
        time: 'Il y a 3 jours',
        read: false 
      }
    ];
  });

  // 2. SAUVEGARDE AUTOMATIQUE
  // À chaque fois que 'notifications' change (lu, supprimé...), on sauvegarde dans le navigateur
  useEffect(() => {
    localStorage.setItem('kevy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // CALCUL DYNAMIQUE
  const unreadCount = notifications.filter(n => !n.read).length;

  // ACTIONS
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

  // Fonction bonus pour réinitialiser (utile pour tes tests)
  const resetNotifications = () => {
    localStorage.removeItem('kevy_notifications');
    window.location.reload();
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
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