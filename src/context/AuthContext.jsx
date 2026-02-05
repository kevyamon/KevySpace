// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // LE MAÎTRE DU TEMPS
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://kevyspace-backend.onrender.com';

  // --- FONCTION DE SIGNAL ---
  const setGlobalLoading = (state) => {
    setLoading(state);
  };

  // 1. CHARGEMENT INITIAL + SÉCURITÉ
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            
            // 🚨 SÉCURITÉ ANTI-BLOCAGE 🚨
            // Si la page (Home, Profil...) oublie de désactiver le loader,
            // on le force à s'éteindre après 2 secondes max.
            setTimeout(() => {
              setLoading(false);
            }, 2000);
            
        } else {
            setLoading(false);
        }
      } catch (error) {
        console.error("Erreur check auth:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // 2. LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`Bon retour, ${res.data.user.name} !`);
      return true;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erreur de connexion';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. REGISTER
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      
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
    } finally {
      setLoading(false);
    }
  };

  // 4. LOGOUT
  const logout = async () => {
    setLoading(true);
    try {
      await axios.get(`${API_URL}/api/auth/logout`);
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success("À bientôt !");
      
      setTimeout(() => {
        setLoading(false); 
      }, 500);
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