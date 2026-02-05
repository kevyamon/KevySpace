// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL BACKEND
  const API_URL = import.meta.env.VITE_API_URL || 'https://kevyspace-backend.onrender.com';

  // 1. CHARGEMENT INITIAL
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

  // 2. LOGIN
  const login = async (email, password) => {
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
    }
  };

  // 3. REGISTER (CORRECTION ICI)
  // On accepte 'formData' (un objet) au lieu de (name, email...) séparés
  const register = async (formData) => {
    try {
      // formData contient déjà { name, email, password, phone }
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success("Compte créé avec succès !");
      return true;
    } catch (error) {
      console.error(error);
      // Gestion d'erreur améliorée pour afficher le message du backend
      const msg = error.response?.data?.error || "Erreur d'inscription";
      toast.error(msg);
      return false;
    }
  };

  // 4. LOGOUT
  const logout = async () => {
    try {
      await axios.get(`${API_URL}/api/auth/logout`);
    } catch (err) {
      console.error(err);
    } finally {
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