import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { X, Home, UploadCloud, LayoutDashboard, ChevronRight, LogOut, User } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { icon: <Home size={22} />, label: 'Accueil', path: '/' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ icon: <LayoutDashboard size={22} />, label: 'Dashboard Admin', path: '/admin/dashboard' });
    menuItems.push({ icon: <UploadCloud size={22} />, label: 'Publier un cours', path: '/admin/upload' });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY FLOU */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 9998,
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* DRAWER MENU */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '280px', backgroundColor: '#FFF', zIndex: 9999,
              boxShadow: '10px 0 30px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column',
              padding: '24px'
            }}
          >
            {/* HEADER : INFO PROFIL & BOUTON FERMER */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                {/* Avatar */}
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', 
                  backgroundColor: 'var(--color-gold)', color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '24px', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                
                {/* Bouton Fermer */}
                <button onClick={onClose} style={{ background: '#F2F2F7', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                  <X size={20} color="#1D1D1F" />
                </button>
              </div>

              {/* Nom & Rôle */}
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: '#1D1D1F' }}>
                {user?.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                {user?.email}
              </p>
              <span style={{ 
                display: 'inline-block', marginTop: '8px', 
                fontSize: '11px', fontWeight: 'bold', 
                padding: '4px 8px', borderRadius: '6px',
                backgroundColor: user?.role === 'admin' ? '#000' : '#E5E5EA',
                color: user?.role === 'admin' ? '#FFF' : '#555'
              }}>
                {user?.role === 'admin' ? 'ADMINISTRATEUR' : 'MEMBRE'}
              </span>
            </div>

            {/* SEPARATEUR */}
            <div style={{ height: '1px', backgroundColor: '#F2F2F7', marginBottom: '24px' }}></div>

            {/* LIENS DE NAVIGATION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigate(item.path)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px', borderRadius: '16px', border: 'none',
                      backgroundColor: isActive ? '#FFFBF0' : 'transparent', // Fond léger doré si actif
                      color: isActive ? 'var(--color-gold)' : '#1D1D1F',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'left', fontSize: '15px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {item.icon}
                      {item.label}
                    </div>
                    {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-gold)' }}></div>}
                  </button>
                );
              })}
            </div>

            {/* BOUTON DÉCONNEXION (EN BAS) */}
            <button
              onClick={handleLogout}
              style={{
                marginTop: 'auto',
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: '16px', borderRadius: '16px',
                border: 'none', background: '#FFF0F0', color: '#FF3B30',
                fontWeight: '600', cursor: 'pointer', fontSize: '15px'
              }}
            >
              <LogOut size={20} />
              Se déconnecter
            </button>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;