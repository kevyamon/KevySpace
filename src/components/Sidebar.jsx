// src/components/Sidebar.jsx
import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ContactModal from './ContactModal'; 
import { 
  X, Home, User, LogOut, 
  Heart, FileText, Download, Clock,
  LayoutDashboard, UploadCloud, HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Accueil', path: '/' },
    { icon: <User size={20} />, label: 'Mon Profil', path: '/profile' },
    { icon: <Heart size={20} />, label: 'Mes Favoris', path: '/favorites' }, 
    { icon: <Clock size={20} />, label: 'Historique', path: '/history' },   
    { icon: <FileText size={20} />, label: 'Mes Certificats', path: '/certificates' }, 
    { icon: <Download size={20} />, label: 'Ressources PDF', path: '/resources' },     
  ];

  if (user?.role === 'admin') {
    menuItems.push({ isSeparator: true });
    menuItems.push({ icon: <LayoutDashboard size={20} />, label: 'Dashboard Admin', path: '/admin/dashboard', isAdmin: true });
    menuItems.push({ icon: <UploadCloud size={20} />, label: 'Publier un cours', path: '/admin/upload', isAdmin: true });
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: 'fixed', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)',
                zIndex: 9998,
              }}
            />

            {/* DRAWER VENANT DE LA DROITE */}
            <motion.div
              initial={{ x: '100%' }} 
              animate={{ x: 0 }}      
              exit={{ x: '100%' }}    
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, 
                width: '80%', maxWidth: '320px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                zIndex: 9999,
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column',
                padding: '24px',
                borderLeft: '1px solid rgba(255,255,255,0.5)'
              }}
            >
              
              {/* BOUTON FERMER */}
              <button 
                onClick={onClose} 
                style={{ 
                  position: 'absolute', top: '24px', left: '24px',
                  background: 'rgba(255,255,255,0.5)', border: 'none', 
                  borderRadius: '50%', padding: '8px', cursor: 'pointer' 
                }}
              >
                <X size={20} color="#1D1D1F" />
              </button>

              {/* PROFIL */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', marginBottom: '32px' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  backgroundColor: 'var(--color-gold)', color: '#FFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '32px', 
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
                  border: '4px solid #FFF',
                  marginBottom: '12px'
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F', textAlign: 'center' }}>
                  {user?.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
                  {user?.email}
                </p>
              </div>

              {/* NAVIGATION */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                
                <button
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 16px', borderRadius: '16px', border: 'none',
                    backgroundColor: '#FFF', 
                    color: '#1D1D1F', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left', fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    marginBottom: '12px'
                  }}
                >
                  <HelpCircle size={20} color="var(--color-gold)" />
                  Contacter le formateur
                </button>

                <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '8px 0' }}></div>

                {menuItems.map((item, index) => {
                  if (item.isSeparator) return <div key={index} style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '8px 0' }}></div>;
                  
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={index}
                      onClick={() => handleNavigate(item.path)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '12px 16px', borderRadius: '14px', border: 'none',
                        backgroundColor: isActive ? 'var(--color-gold)' : 'transparent',
                        color: isActive ? '#000' : (item.isAdmin ? '#FF3B30' : '#1D1D1F'),
                        fontWeight: isActive ? '700' : '500',
                        cursor: 'pointer', transition: 'all 0.2s',
                        textAlign: 'left', fontSize: '15px'
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', padding: '14px', borderRadius: '16px',
                    border: '1px solid #FF3B30', background: 'transparent', 
                    color: '#FF3B30', fontWeight: '600', cursor: 'pointer', fontSize: '15px'
                  }}
                >
                  <LogOut size={18} />
                  Se déconnecter
                </button>
                
                <p style={{ textAlign: 'center', fontSize: '11px', color: '#AAA', marginTop: '16px', fontWeight: '500' }}>
                  KevySpace v1.0.2
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* LA MODALE EST APPELÉE ICI MAIS S'AFFICHERA EN PORTAL */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Sidebar;