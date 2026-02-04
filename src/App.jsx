// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import MobileLayout from './components/MobileLayout';

// --- PAGES PUBLIQUES ---
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// --- PAGES COMMUNES ---
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Watch from './pages/Watch';

// --- PAGES ÉTUDIANT (USER) ---
import Favorites from './pages/Favorites';
import History from './pages/History';
import Certificates from './pages/Certificates';
import Resources from './pages/Resources';

// --- PAGES ADMIN ---
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUpload from './pages/admin/AdminUpload';
import AdminResources from './pages/admin/AdminResources';     // <--- AJOUT
import AdminCertificates from './pages/admin/AdminCertificates'; // <--- AJOUT

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>;
  }

  // Redirection intelligente si on arrive sur la racine "/"
  const getHomeRoute = () => {
    if (!user) return <Landing />;
    if (user.role === 'admin') return <AdminDashboard />;
    return <Home />;
  };

  return (
    <NotificationProvider>
      <MobileLayout>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: { borderRadius: '16px', background: '#333', color: '#fff' },
            success: { style: { background: '#E5F9E5', color: '#000', border: '1px solid #34C759' } },
            error: { style: { background: '#FFE5E5', color: '#000', border: '1px solid #FF3B30' } },
          }}
        />
        
        <Routes>
          {/* ROUTES PUBLIQUES */}
          <Route path="/" element={getHomeRoute()} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ROUTES COMMUNES PROTÉGÉES */}
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/watch/:id" element={user ? <Watch /> : <Navigate to="/login" />} />

          {/* ROUTES ÉTUDIANT */}
          <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
          <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
          <Route path="/certificates" element={user ? <Certificates /> : <Navigate to="/login" />} />
          <Route path="/resources" element={user ? <Resources /> : <Navigate to="/login" />} />
          
          {/* ROUTES ADMIN */}
          <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/upload" element={user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
          {/* Nouvelles routes Admin */}
          <Route path="/admin/resources" element={user?.role === 'admin' ? <AdminResources /> : <Navigate to="/" />} />
          <Route path="/admin/certificates" element={user?.role === 'admin' ? <AdminCertificates /> : <Navigate to="/" />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MobileLayout>
    </NotificationProvider>
  );
}

export default App;