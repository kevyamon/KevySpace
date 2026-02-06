// src/App.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { UpdateProvider } from './context/UpdateContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import MobileLayout from './components/MobileLayout';
import UpdateNotification from './components/UpdateNotification';
import GlobalLoader from './components/GlobalLoader';
import OfflineModal from './components/OfflineModal';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Watch from './pages/Watch';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Certificates from './pages/Certificates';
import Resources from './pages/Resources';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUpload from './pages/admin/AdminUpload';
import AdminResources from './pages/admin/AdminResources';     
import AdminCertificates from './pages/admin/AdminCertificates'; 

function App() {
  const { user, loading } = useContext(AuthContext);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getHomeRoute = () => {
    if (!user) return <Landing />;
    if (user.role === 'admin') return <AdminDashboard />;
    return <Home />;
  };

  return (
    <NotificationProvider>
      <ThemeProvider>
        <UpdateProvider>
          
          {loading && <GlobalLoader text="Chargement..." />}
          
          <OfflineModal isOffline={isOffline} />

          <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}>
            <MobileLayout>
              <Toaster 
                position="top-center"
                containerStyle={{ zIndex: 9999999 }}
                toastOptions={{
                  style: { borderRadius: '16px', background: '#333', color: '#fff', fontSize: '14px', fontWeight: '500' },
                  success: { style: { background: '#E5F9E5', color: '#1D1D1F', border: '1px solid #34C759' }, iconTheme: { primary: '#34C759', secondary: '#E5F9E5' } },
                  error: { style: { background: '#FFE5E5', color: '#1D1D1F', border: '1px solid #FF3B30' }, iconTheme: { primary: '#FF3B30', secondary: '#FFE5E5' } },
                }}
              />

              <UpdateNotification />
              
              <Routes>
                <Route path="/" element={getHomeRoute()} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
                <Route path="/watch/:id" element={user ? <Watch /> : <Navigate to="/login" />} />

                <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
                <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
                <Route path="/certificates" element={user ? <Certificates /> : <Navigate to="/login" />} />
                <Route path="/resources" element={user ? <Resources /> : <Navigate to="/login" />} />
                
                <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/admin/upload" element={user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
                <Route path="/admin/resources" element={user?.role === 'admin' ? <AdminResources /> : <Navigate to="/" />} />
                <Route path="/admin/certificates" element={user?.role === 'admin' ? <AdminCertificates /> : <Navigate to="/" />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

            </MobileLayout>
          </div>
        </UpdateProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

export default App;