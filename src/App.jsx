// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import MobileLayout from './components/MobileLayout';

// PAGES PUBLIQUES
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// PAGES UTILISATEUR
import Home from './pages/Home';

// PAGES ADMIN (NOUVEAU)
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUpload from './pages/admin/AdminUpload';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement...</div>;
  }

  // Fonction pour décider où envoyer l'utilisateur connecté
  const getHomeRoute = () => {
    if (!user) return <Landing />;
    // Si c'est l'ADMIN, il va direct à son Dashboard
    if (user.role === 'admin') return <AdminDashboard />;
    // Si c'est un USER, il va à l'accueil classique
    return <Home />;
  };

  return (
    <MobileLayout>
      <Routes>
        {/* Route intelligente */}
        <Route path="/" element={getHomeRoute()} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ROUTES ADMIN SÉCURISÉES */}
        <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/admin/upload" element={user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MobileLayout>
  );
}

export default App;