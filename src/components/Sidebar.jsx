// src/components/Sidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ContactModal from './ContactModal'; 
import logoImg from '../assets/logo.png'; 

import { 
  X, Home, User, LogOut, 
  Heart, FileText, Download, Clock,
  LayoutDashboard, UploadCloud, HelpCircle, Award
} from 'lucide-react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const isMobile = useIsMobile(); 

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose(); 
  };

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const userLinks = [
    { icon: <Home size={20} />, label: 'Accueil', path: '/' },
    { icon: <User size={20} />, label: 'Mon Profil', path: '/profile' },
    { icon: <Heart size={20} />, label: 'Mes Favoris', path: '/favorites' }, 
    { icon: <Clock size={20} />, label: 'Historique', path: '/history' },   
    { icon: <Award size={20} />, label: 'Mes Certificats', path: '/certificates' },
    { icon: <Download size={20} />, label: 'Ressources PDF', path: '/resources' },     
  ];

  const adminLinks = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard Admin', path: '/admin/dashboard', isAdmin: true },
    { icon: <UploadCloud size={20} />, label: 'Publier un cours', path: '/admin/upload', isAdmin: true },
    { icon: <Download size={20} />, label: 'Gérer Ressources', path: '/admin/resources', isAdmin: true },
    { icon: <Award size={20} />, label: 'Gérer Certificats', path: '/admin/certificates', isAdmin: true },
    { isSeparator: true },
    { icon: <Home size={20} />, label: 'Vue Site (Accueil)', path: '/home', isHighlight: true },
    { icon: <User size={20} />, label: 'Mon Profil', path: '/profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminLinks : userLinks;

  const renderMenuContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* HEADER : COMPACTÉ POUR GAGNER DE LA PLACE */}
      <div style={{ marginBottom: '20px', textAlign: 'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        {isMobile ? (
           // MODE MOBILE : Avatar COMPACT
           <>
              <div style={{ 
                // Réduction de 80px à 64px
                width: '64px', height: '64px', borderRadius: '50%', 
                backgroundColor: 'var(--color-gold)', color: '#FFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '26px', // Police réduite
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                border: '3px solid #FFF', marginBottom: '8px' // Marge réduite
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1D1D1F', marginBottom: '2px' }}>{user?.name}</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                {user?.role === 'admin' ? 'Administrateur' : user?.email}
              </p>
           </>
        ) : (
           // MODE DESKTOP
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', width: '100%', marginBottom: '4px' }}>
              <div style={{ 
                  width: '40px', height: '40px', 
                  minWidth: '40px', minHeight: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img 
                  src={logoImg} 
                  alt="Logo" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    objectFit: 'cover',
                    borderRadius: '50%',
                    clipPath: 'circle(50% at 50% 50%)',
                    WebkitClipPath: 'circle(50% at 50% 50%)' 
                  }} 
                />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F' }}>KevySpace</span>
           </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
        {user?.role !== 'admin' && (
          <>
            <button
              onClick={() => setIsContactOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', // Padding réduit légèrement
                borderRadius: '16px', border: 'none',
                backgroundColor: isMobile ? '#FFF' : '#F5F5F7', 
                color: '#1D1D1F', fontWeight: '600',
                cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.03)' : 'none', 
                marginBottom: '8px'
              }}
            >
              <HelpCircle size={18} color="var(--color-gold)" />
              Contacter le formateur
            </button>
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '4px 0' }}></div>
          </>
        )}

        {menuItems.map((item, index) => {
          if (item.isSeparator) return <div key={index} style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '4px 0' }}></div>;
          
          const isActive = location.pathname === item.path;
          const specialStyle = item.isHighlight ? {
            backgroundColor: '#FFD700', color: '#000', fontWeight: '800',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
          } : {};

          return (
            <button
              key={index}
              onClick={() => handleNavigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '10px 16px', // Padding optimisé
                borderRadius: '14px', border: 'none',
                backgroundColor: isActive ? (isMobile ? 'rgba(0,0,0,0.05)' : '#1D1D1F') : 'transparent',
                color: isActive ? (isMobile ? '#000' : '#FFF') : (item.isAdmin ? '#FF3B30' : '#1D1D1F'),
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'left', fontSize: '14px', // Police optimisée
                ...specialStyle
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '16px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', padding: '12px', borderRadius: '16px',
            border: '1px solid #FF3B30', background: 'transparent', 
            color: '#FF3B30', fontWeight: '600', cursor: 'pointer', fontSize: '14px'
          }}
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '10px', 
          color: '#AAA', 
          marginTop: '8px',
          fontWeight: '500',
          opacity: 0.7, 
          letterSpacing: '0.5px'
        }}>
          KevySpace v{typeof __APP_VERSION_DISPLAY__ !== 'undefined' ? __APP_VERSION_DISPLAY__ : '1.0.0'}
        </p>
      </div>
    </div>
  );

  // Rendu Bureau
  if (!isMobile) {
    return (
      <div style={{ width: '280px', height: '100vh', backgroundColor: '#FFF', borderRight: '1px solid #F5F5F7', padding: '24px 20px', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
        {renderMenuContent()}
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    );
  }

  // Rendu Mobile (Drawer)
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', zIndex: 9998 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, 
                width: '80%', maxWidth: '320px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)', zIndex: 9999,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', padding: '20px', // Padding global réduit
                borderLeft: '1px solid rgba(255,255,255,0.5)'
              }}
            >
              <button onClick={onClose} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}>
                <X size={20} color="#1D1D1F" />
              </button>
              <div style={{ marginTop: '30px', height: '100%' }}>
                 {renderMenuContent()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Sidebar;