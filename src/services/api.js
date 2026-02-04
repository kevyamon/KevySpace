import axios from 'axios';

// 1. Création de l'instance Axios
const api = axios.create({
  baseURL: 'https://kevyspace-backend.onrender.com', // Ton Backend Render
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. INTERCEPTOR REQUÊTE (Le facteur)
// Avant chaque envoi, on glisse le token dans l'enveloppe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kevy_token'); // On récupère le sésame
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. INTERCEPTOR RÉPONSE (Le vigile)
// Si le serveur dit "401 Non autorisé", on déconnecte proprement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expiré ou invalide -> On nettoie et on redirige
      localStorage.removeItem('kevy_token');
      localStorage.removeItem('kevy_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;