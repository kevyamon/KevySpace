// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // DONNÉES SIMULÉES (En attendant le Backend/Socket)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Bienvenue sur KevySpace !',
      description: 'Nous sommes ravis de vous compter parmi nous. N\'oubliez pas de compléter votre profil.',
      time: 'Il y a 2 heures',
      read: false // Non lu
    },
    {
      id: 2,
      type: 'success',
      title: 'Module 1 validé',
      description: 'Félicitations ! Vous avez terminé le premier module avec succès.',
      time: 'Hier',
      read: true // Lu
    },
    {
      id: 3,
      type: 'warning',
      title: 'Maintenance prévue',
      description: 'Une maintenance des serveurs aura lieu ce soir à minuit.',
      time: 'Il y a 3 jours',
      read: false // Non lu
    }
  ]);

  // CALCUL DYNAMIQUE : Combien de non-lus ?
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
    // Pour l'instant on supprime, plus tard on pourra déplacer vers "Archives"
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification,
      archiveNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};