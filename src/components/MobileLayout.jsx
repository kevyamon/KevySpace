// src/components/MobileLayout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import HeaderHomeButton from './HeaderHomeButton'; // <--- 1. IMPORT DU COMPOSANT
import logoImg from '../assets/logo.png'; 

// HOOK POUR LA DÉTECTION D'ÉCRAN
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const MobileLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isMobile = useIsMobile();

  // FILTRES D'AFFICHAGE
  const hideForAuth = ['/login', '/register', '/landing'].includes(location.pathname);
  const isPublicPage = !user && location.pathname === '/';
  
  const showNavbar = user && !hideForAuth && !isPublicPage;
  const showSidebarDesktop = user && !hideForAuth && !isPublicPage;

  // --- VERSION DESKTOP ---
  if (!isMobile) {
    if (!showSidebarDesktop) {
        return <>{children}</>;
    }
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Sidebar /> 
        <div style={{ flex: 1, marginLeft: '280px', position: 'relative' }}>
          {children}
        </div>
      </div>
    );
  }

  // --- VERSION MOBILE ---
  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* NAVBAR FIXE */}
      {showNavbar && (
        <div style={{
          flexShrink: 0, 
          height: '60px',
          display: 'flex', alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 20px', backgroundColor: '#FFF', borderBottom: '1px solid #EEE',
          zIndex: 10 
        }}>
          
          {/* 1. BOUTON HOME À GAUCHE (Remplace le vide) */}
          <div style={{ width: '32px' }}> {/* Conteneur pour assurer l'alignement */}
             <HeaderHomeButton size={24} />
          </div>

          {/* 2. LOGO + TEXTE CENTRÉ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <img src={logoImg} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '50%' }} />
             <div style={{ fontWeight: '800', fontSize: '18px', color: '#1D1D1F' }}>
               Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
             </div>
          </div>

          {/* 3. HAMBURGER À DROITE */}
          <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <Menu size={24} color="#1D1D1F" />
            </button>
          </div>

        </div>
      )}

      {/* ZONE DE CONTENU */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        WebkitOverflowScrolling: 'touch' 
      }}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;