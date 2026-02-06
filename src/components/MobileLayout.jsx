// src/components/MobileLayout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import HeaderHomeButton from './HeaderHomeButton';
import logoImg from '../assets/logo.png'; 

// HOOK POUR LA DÉTECTION D'ÉCRAN
const useIsMobile = () => {
  // On considère "Mobile" tout ce qui est plus petit qu'une tablette standard (iPad portrait)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
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

  // --- VERSION DESKTOP (Dashboard fluide) ---
  if (!isMobile) {
    // Si on n'est pas connecté ou sur une page publique, on affiche juste le contenu centré full-width
    if (!showSidebarDesktop) {
        return (
          <div style={{ 
            minHeight: '100vh', 
            width: '100%',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text-main)'
          }}>
            {children}
          </div>
        );
    }

    // Structure Dashboard : Sidebar Fixe à gauche + Contenu fluide à droite
    return (
      <div style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text-main)'
      }}>
        {/* Container Sidebar - On suppose que le composant Sidebar gère sa largeur interne */}
        <div style={{ 
          width: '280px', 
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          borderRight: '1px solid var(--border-color)'
        }}>
          <Sidebar /> 
        </div>

        {/* Zone de contenu principale */}
        <div style={{ 
          flex: 1, 
          position: 'relative',
          maxWidth: 'calc(100% - 280px)', // Empêche le débordement horizontal
          overflowX: 'hidden'
        }}>
          <div style={{ 
            maxWidth: '1200px', // On limite la largeur du contenu pour la lisibilité sur les écrans géants
            margin: '0 auto',
            padding: '24px',
            height: '100%'
          }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // --- VERSION MOBILE (inchangée dans la logique, ajustée pour les thèmes) ---
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh', // Utilisation de min-height pour permettre le scroll naturel
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text-main)',
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
          padding: '0 20px', 
          backgroundColor: 'var(--bg-surface)', 
          borderBottom: '1px solid var(--border-color)',
          zIndex: 10,
          position: 'sticky',
          top: 0
        }}>
          
          {/* 1. BOUTON HOME À GAUCHE */}
          <div style={{ width: '32px' }}> 
             <HeaderHomeButton size={24} />
          </div>

          {/* 2. LOGO + TEXTE CENTRÉ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <img src={logoImg} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '50%' }} />
             <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--color-text-main)' }}>
               Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
             </div>
          </div>

          {/* 3. HAMBURGER À DROITE */}
          <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <Menu size={24} color="var(--color-text-main)" />
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