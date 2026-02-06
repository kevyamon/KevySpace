// src/components/Sidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useUpdate } from '../context/UpdateContext'; 
import ContactModal from './ContactModal'; 
import logoImg from '../assets/logo.png'; 
import packageJson from '../../package.json'; 

import { 
  X, Home, User, LogOut, Heart, FileText, Download, Clock,
  LayoutDashboard, UploadCloud, HelpCircle, Award,
  RefreshCw 
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
  const { triggerManualCheck, updateStatus } = useUpdate(); 
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
      
      {/* HEADER */}
      <div style={{ marginBottom: '20px', textAlign: 'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
        {isMobile ? (
           <>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', 
                backgroundColor: user?.profilePicture ? 'transparent' : 'var(--color-gold)', 
                color: '#FFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '26px', 
                boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                border: '3px solid var(--bg-surface)', 
                marginBottom: '8px',
                overflow: 'hidden'
              }}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>{user?.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                {user?.role === 'admin' ? 'Administrateur' : user?.email}
              </p>
           </>
        ) : (
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', width: '100%', marginBottom: '4px' }}>
              <div style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logoImg} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', clipPath: 'circle(50% at 50% 50%)', WebkitClipPath: 'circle(50% at 50% 50%)' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>KevySpace</span>
           </div>
        )}
        {/* SUPPRESSION DU THEMETOGGLE - PLUS DE BOUTON MODE NUIT */}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
        {user?.role !== 'admin' && (
          <>
            <button
              onClick={() => setIsContactOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', borderRadius: '16px', border: 'none',
                backgroundColor: isMobile ? 'var(--bg-input)' : 'var(--bg-main)', 
                color: 'var(--text-primary)', fontWeight: '600',
                cursor: 'pointer', textAlign: 'left', fontSize: '14px',
                boxShadow: isMobile ? '0 2px 8px var(--shadow-color)' : 'none', 
                marginBottom: '8px'
              }}
            >
              <HelpCircle size={18} color="var(--color-gold)" />
              Contacter le formateur
            </button>
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>
          </>
        )}

        {menuItems.map((item, index) => {
          if (item.isSeparator) return <div key={index} style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>;
          
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
                padding: '10px 16px', borderRadius: '14px', border: 'none',
                backgroundColor: isActive ? (isMobile ? 'var(--border-color)' : 'var(--bg-input)') : 'transparent',
                color: isActive ? 'var(--text-primary)' : (item.isAdmin ? '#FF3B30' : 'var(--text-primary)'),
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer', transition: 'all 0.2s',
                textAlign: 'left', fontSize: '14px', 
                ...specialStyle
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
        
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>
        <button
          onClick={() => { triggerManualCheck(); if(onClose) onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '10px 16px', borderRadius: '14px', border: 'none',
            backgroundColor: 'transparent',
            color: updateStatus === 'waiting' ? '#FF9500' : 'var(--text-secondary)',
            fontWeight: '600',
            cursor: 'pointer', transition: 'all 0.2s',
            textAlign: 'left', fontSize: '14px', 
          }}
        >
          <RefreshCw size={18} />
          {updateStatus === 'waiting' ? 'Mise à jour (En attente)' : 'Vérifier mise à jour'}
        </button>

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
        <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500', opacity: 0.7, letterSpacing: '0.5px' }}>
          KevySpace v{packageJson.version}
        </p>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div style={{ width: '280px', height: '100vh', backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', padding: '24px 20px', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
        {renderMenuContent()}
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    );
  }

  // Rendu Mobile
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9998 }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, 
                width: '80%', maxWidth: '320px',
                backgroundColor: 'var(--bg-surface)', 
                backdropFilter: 'blur(20px)', zIndex: 9999,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column', padding: '20px', 
                borderLeft: '1px solid var(--border-color)'
              }}
            >
              {/* --- BOUTON FERMER AMÉLIORÉ & ANIMÉ --- */}
              <motion.button 
                onClick={onClose} 
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{ 
                  position: 'absolute', top: '20px', left: '20px', 
                  background: 'var(--bg-input)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '50%', 
                  width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px var(--shadow-color)',
                  zIndex: 20
                }}
              >
                <X size={22} color="var(--text-primary)" />
              </motion.button>
              
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