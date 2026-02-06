// src/services/api.js
import axios from 'axios';

// 1. Création de l'instance Axios
const api = axios.create({
  // Utilise la variable d'env ou le lien en dur si besoin
  baseURL: import.meta.env.VITE_API_URL || 'https://kevyspace-backend.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important pour les cookies de secours
});

// 2. INTERCEPTOR REQUÊTE (Correction des clés)
api.interceptors.request.use(
  (config) => {
    // CORRECTION ICI : On cherche 'token', pas 'kevy_token'
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. INTERCEPTOR RÉPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // CORRECTION ICI : On nettoie les bonnes clés
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // On redirige proprement sans recharger si possible, sinon href
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;