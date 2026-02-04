import React, { createContext, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast'; // <--- IMPORT

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kevy_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  const saveSession = (userData, token) => {
    setUser(userData);
    localStorage.setItem('kevy_user', JSON.stringify(userData));
    localStorage.setItem('kevy_token', token);
  };

  // Inscription
  const register = async (userData) => {
    setLoading(true);
    const loadingToast = toast.loading('Création du compte...'); // Petit loading sympa
    try {
      const res = await api.post('/api/auth/register', userData);
      saveSession(res.data.user, res.data.token);
      toast.dismiss(loadingToast); // On vire le loading
      toast.success(`Bienvenue ${res.data.user.name} ! 🎉`); // Succès !
      return { success: true };
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.error || "Erreur d'inscription";
      toast.error(msg); // Erreur rouge
      return { success: false, error: msg };
    } finally { setLoading(false); }
  };

  // Connexion
  const login = async (email, password) => {
    setLoading(true);
    const loadingToast = toast.loading('Connexion...');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      saveSession(res.data.user, res.data.token);
      toast.dismiss(loadingToast);
      toast.success('Ravi de vous revoir ! 👋');
      return { success: true };
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.error || "Erreur de connexion";
      toast.error(msg);
      return { success: false, error: msg };
    } finally { setLoading(false); }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('kevy_user');
    localStorage.removeItem('kevy_token');
    try { api.get('/api/auth/logout'); } catch (e) {}
    toast.success('Déconnecté avec succès');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};