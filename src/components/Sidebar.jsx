// src/components/Sidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useUpdate } from '../context/UpdateContext'; 
import ThemeToggle from './ThemeToggle';
import ContactModal from './ContactModal'; 
import packageJson from '../../package.json'; 

// Note: On n'utilise plus trop les icônes dans ce style "Editorial", 
// on mise tout sur la typographie. Mais je garde la logique.

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const { triggerManualCheck, updateStatus } = useUpdate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isContactOpen, setIsContactOpen] = useState(false);

  // --- CONFIGURATION DES MENUS ---
  const userLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Profil', path: '/profile' },
    { label: 'Favoris', path: '/favorites' }, 
    { label: 'Historique', path: '/history' },   
    { label: 'Certificats', path: '/certificates' },
    { label: 'Ressources', path: '/resources' },     
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', isAdmin: true },
    { label: 'Publier', path: '/admin/upload', isAdmin: true },
    { label: 'Ressources', path: '/admin/resources', isAdmin: true },
    { label: 'Certificats', path: '/admin/certificates', isAdmin: true },
    { isSeparator: true },
    { label: 'Site Public', path: '/home' },
    { label: 'Mon Profil', path: '/profile' },
  ];

  const menuItems = user?.role === 'admin' ? adminLinks : userLinks;

  const handleNavigate = (path) => {
    navigate(path);
    onClose(); 
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  // --- VARIANTS FRAMER MOTION (L'EFFET VAGUE) ---
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const listVariants = {
    open: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } // Effet cascade
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    open: {
      y: 0, opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } }
    },
    closed: {
      y: 50, opacity: 0,
      transition: { y: { stiffness: 1000 } }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 1. OVERLAY (Fond sombre) */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={onClose} 
              style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)', // Petit flou moderne en plus
                zIndex: 1500
              }} 
            />

            {/* 2. SIDEBAR PARTIELLE */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{
                position: 'fixed', top: 0, right: 0,
                width: '300px', maxWidth: '85%', height: '100vh',
                backgroundColor: 'var(--bg-surface)', // S'adapte au mode nuit
                zIndex: 2000,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.2)'
              }}
            >
              
              {/* BOUTON FERMER "X" (Style CSS personnalisé) */}
              <div 
                onClick={onClose}
                style={{
                  position: 'absolute', top: '30px', right: '30px',
                  width: '30px', height: '30px', cursor: 'pointer', zIndex: 2100
                }}
              >
                <div style={{
                  position: 'absolute', left: 0, top: '12px', width: '100%', height: '3px',
                  backgroundColor: 'var(--text-primary)', borderRadius: '2px',
                  transform: 'rotate(45deg)'
                }}></div>
                <div style={{
                  position: 'absolute', left: 0, top: '12px', width: '100%', height: '3px',
                  backgroundColor: 'var(--text-primary)', borderRadius: '2px',
                  transform: 'rotate(-45deg)'
                }}></div>
              </div>

              {/* CONTENU NAVIGATION (EFFET VAGUE) */}
              <motion.ul 
                variants={listVariants}
                style={{ 
                  listStyle: 'none', padding: 0, margin: 0, textAlign: 'center',
                  display: 'flex', flexDirection: 'column', gap: '20px' // Espacement vertical
                }}
              >
                {/* HEADER UTILISATEUR */}
                <motion.li variants={itemVariants} style={{ marginBottom: '20px' }}>
                   <div style={{ 
                      width: '60px', height: '60px', margin: '0 auto 10px auto', 
                      borderRadius: '50%', overflow: 'hidden', 
                      background: 'var(--bg-input)', border: '2px solid var(--color-gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{user?.name?.[0]}</span>
                      )}
                   </div>
                   <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontFamily: 'serif', fontStyle: 'italic' }}>
                      Bonjour, {user?.name}
                   </p>
                </motion.li>

                {/* LIENS DE NAVIGATION */}
                {menuItems.map((item, index) => {
                  if (item.isSeparator) return <div key={index} style={{ width: '20px', height: '1px', background: 'var(--border-color)', margin: '10px auto' }}></div>;
                  
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.li key={index} variants={itemVariants}>
                      <span 
                        onClick={() => handleNavigate(item.path)}
                        style={{
                          fontSize: '2rem', // GRANDE TAILLE (Style CSS fourni)
                          fontFamily: 'serif', // POLICE SERIF
                          fontWeight: isActive ? '700' : '400',
                          color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          textDecoration: isActive ? 'underline' : 'none',
                          textUnderlineOffset: '8px',
                          textDecorationColor: 'var(--color-gold)',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'}
                        onMouseLeave={(e) => !isActive && (e.target.style.color = 'var(--text-primary)')}
                      >
                        {item.label}
                      </span>
                    </motion.li>
                  );
                })}

                {/* OPTIONS SUPPLÉMENTAIRES */}
                <motion.li variants={itemVariants} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                   
                   {/* TOGGLE THEME */}
                   <ThemeToggle />

                   {/* MISE À JOUR */}
                   <button 
                      onClick={() => { triggerManualCheck(); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}
                   >
                      {updateStatus === 'waiting' ? 'Mise à jour dispo !' : 'Version ' + packageJson.version}
                   </button>

                   {/* DÉCONNEXION */}
                   <button 
                      onClick={handleLogout}
                      style={{ 
                        background: 'transparent', border: '1px solid var(--color-danger)', 
                        padding: '10px 20px', borderRadius: '30px',
                        color: 'var(--color-danger)', fontWeight: '600', cursor: 'pointer',
                        marginTop: '10px'
                      }}
                   >
                      Se déconnecter
                   </button>
                </motion.li>

              </motion.ul>

            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Sidebar;