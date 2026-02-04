import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Création du contexte
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // On récupère l'utilisateur stocké localement
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kevy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CONFIGURATION AXIOS GLOBALE
  // URL en dur pour garantir la connexion immédiate
  const api = axios.create({
    baseURL: "https://kevyspace-backend.onrender.com",
    withCredentials: true, // Important pour les cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Fonction d'inscription
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/register', userData);
      setUser(res.data.user);
      localStorage.setItem('kevy_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur lors de l\'inscription';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('kevy_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Erreur de connexion';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.get('/api/auth/logout');
    } catch (err) {
      console.error("Erreur logout", err);
    }
    setUser(null);
    localStorage.removeItem('kevy_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      register, 
      login, 
      logout,
      setError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};