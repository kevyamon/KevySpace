// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL BACKEND (Utilise la variable d'env ou le lien en dur)
  const API_URL = import.meta.env.VITE_API_URL || 'https://kevyspace-backend.onrender.com';

  // 1. CHARGEMENT INITIAL (Au rafraîchissement de la page)
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // On vérifie si un token existe
        const token = localStorage.getItem('token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        // Si token existe, on vérifie s'il est valide auprès du serveur
        // (Optionnel mais recommandé : une route /me ou /profile)
        // Pour l'instant, on suppose que si le token est là, on récupère l'user stocké
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erreur check auth:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // 2. FONCTION LOGIN (C'est ici qu'on avait oublié le token !)
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      // A. On sauvegarde les données dans le State (RAM)
      setUser(res.data.user);
      
      // B. IMPORTANT : On sauvegarde le token et l'user dans le Storage (Disque Dur)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`Bon retour, ${res.data.user.name} !`);
      return true; // Succès
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erreur de connexion';
      toast.error(msg);
      return false; // Échec
    }
  };

  // 3. FONCTION REGISTER
  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, phone });
      
      // Même chose ici : on sauvegarde tout
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success("Compte créé avec succès !");
      return true;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erreur d'inscription";
      toast.error(msg);
      return false;
    }
  };

  // 4. FONCTION LOGOUT
  const logout = async () => {
    try {
      // On prévient le serveur (optionnel pour les cookies)
      await axios.get(`${API_URL}/api/auth/logout`);
    } catch (err) {
      console.error(err);
    } finally {
      // NETTOYAGE COMPLET
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success("À bientôt !");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};