// src/components/MobileLayout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo.png'; // <--- IMPORT DU LOGO

// HOOK POUR LA DÉTECTION D'ÉCRAN (Seuil Tablette/PC : 768px)
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
  const isMobile = useIsMobile(); // <--- ON ACTIVE LA DÉTECTION

  // FILTRES D'AFFICHAGE
  const hideForAuth = ['/login', '/register', '/landing'].includes(location.pathname);
  const isPublicPage = !user && location.pathname === '/';
  
  // Mobile : Navbar visible ?
  const showNavbar = user && !hideForAuth && !isPublicPage;
  
  // Desktop : Sidebar visible ?
  const showSidebarDesktop = user && !hideForAuth && !isPublicPage;

  // --- VERSION DESKTOP (Split Screen - Classique) ---
  if (!isMobile) {
    // Si on est sur Login/Register/Landing, on affiche juste le contenu centré
    if (!showSidebarDesktop) {
        return <>{children}</>;
    }
    // Sinon, on affiche la Sidebar à gauche et le contenu à droite
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Sidebar /> 
        <div style={{ flex: 1, marginLeft: '280px', position: 'relative' }}>
          {children}
        </div>
      </div>
    );
  }

  // --- VERSION MOBILE (Ta version propre + Logo) ---
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
      
      {/* Sidebar Mobile (Mode Drawer) */}
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
          
          {/* 1. ÉQUILIBRE À GAUCHE (Invisible) */}
          <div style={{ width: '24px' }}></div> 

          {/* 2. LOGO + TEXTE CENTRÉ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <img src={logoImg} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
             <div style={{ fontWeight: '800', fontSize: '18px', color: '#1D1D1F' }}>
               Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
             </div>
          </div>

          {/* 3. HAMBURGER À DROITE */}
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <Menu size={24} color="#1D1D1F" />
          </button>

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