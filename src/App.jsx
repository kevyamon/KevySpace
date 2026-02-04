// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; 
import { Toaster } from 'react-hot-toast'; 
import MobileLayout from './components/MobileLayout';

// PAGES
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Watch from './pages/Watch'; // <--- IMPORT AJOUTÉ ICI
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUpload from './pages/admin/AdminUpload';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Chargement...</div>;
  }

  const getHomeRoute = () => {
    if (!user) return <Landing />;
    if (user.role === 'admin') return <AdminDashboard />;
    return <Home />;
  };

  return (
    // ON ENVELOPPE TOUT DANS LE PROVIDER DE NOTIFICATIONS
    <NotificationProvider>
      <MobileLayout>
        {/* CONFIGURATION DES TOASTS */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '16px',
              background: '#333',
              color: '#fff',
            },
            success: {
              style: { background: '#E5F9E5', color: '#000', border: '1px solid #34C759' },
              iconTheme: { primary: '#34C759', secondary: '#FFFAEE' },
            },
            error: {
              style: { background: '#FFE5E5', color: '#000', border: '1px solid #FF3B30' },
              iconTheme: { primary: '#FF3B30', secondary: '#FFFAEE' },
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={getHomeRoute()} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
          
          {/* NOUVELLE ROUTE CINÉMA (WATCH) AJOUTÉE ICI 👇 */}
          <Route path="/watch/:id" element={user ? <Watch /> : <Navigate to="/login" />} />
          
          <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/upload" element={user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MobileLayout>
    </NotificationProvider>
  );
}

export default App;