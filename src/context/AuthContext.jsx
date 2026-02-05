// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Utilisation de la variable d'environnement pour l'URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://kevyspace-backend.onrender.com';

  // Configuration globale d'Axios pour inclure le token partout
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []); // Se lance une fois au montage

  // Fonction de signal pour le loader global
  const setGlobalLoading = (state) => {
    setLoading(state);
  };

  // 1. VÉRIFICATION AU DÉMARRAGE
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        // On remet le token dans axios par sécurité
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Optionnel : On pourrait vérifier le token auprès du serveur ici
        // Mais pour l'instant, on fait confiance au localStorage pour éviter le logout intempestif
        setUser(JSON.parse(storedUser));
        
      } catch (error) {
        console.error("Erreur check auth:", error);
        // Si le JSON est corrompu, on nettoie
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        // Sécurité : On laisse le loader partir après 1s max si la page ne le fait pas
        setTimeout(() => setLoading(false), 1000);
      }
    };

    checkUserLoggedIn();
  }, []);

  // 2. LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      // STOCKAGE CRITIQUE
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Mise à jour d'Axios pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      toast.success(`Bon retour, ${user.name} !`);
      return true;

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erreur de connexion';
      toast.error(msg);
      throw error; // On renvoie l'erreur pour que le Login.jsx sache qu'il a échoué
    } finally {
      setLoading(false);
    }
  };

  // 3. REGISTER
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      toast.success("Compte créé avec succès !");
      return true;

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erreur d'inscription";
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      // On essaie de prévenir le serveur, mais on ne bloque pas si ça échoue
      await axios.get(`${API_URL}/api/auth/logout`).catch(() => {});
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      toast.success("À bientôt !");
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      register, 
      logout, 
      loading, 
      setGlobalLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};