// src/components/MobileLayout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import HeaderHomeButton from './HeaderHomeButton';
import logoImg from '../assets/logo.png'; 

// HOOK POUR LA DÉTECTION D'ÉCRAN AMÉLIORÉ
const useScreenType = () => {
  const [screenType, setScreenType] = useState(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenType('mobile');
      else if (width < 1024) setScreenType('tablet');
      else setScreenType('desktop');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenType;
};

const MobileLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const screenType = useScreenType();

  // FILTRES D'AFFICHAGE
  const hideForAuth = ['/login', '/register', '/landing'].includes(location.pathname);
  const isPublicPage = !user && location.pathname === '/';
  
  const showNavbar = user && !hideForAuth && !isPublicPage;
  const showSidebar = user && !hideForAuth && !isPublicPage;

  // =========================================
  // 1. VERSION DESKTOP (>= 1024px)
  // =========================================
  if (screenType === 'desktop') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* HEADER DESKTOP */}
        {showNavbar && (
          <header style={{
            height: '64px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 10px var(--shadow-color)',
            flexShrink: 0
          }}>
            {/* LOGO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={logoImg} 
                alt="Logo" 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  objectFit: 'cover', 
                  borderRadius: '50%' 
                }} 
              />
              <div style={{ 
                fontWeight: '800', 
                fontSize: '20px', 
                color: 'var(--color-text-main)' 
              }}>
                Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
              </div>
            </div>

            {/* BOUTON HOME DESKTOP */}
            <div>
              <HeaderHomeButton size={24} />
            </div>
          </header>
        )}

        {/* CONTENU PRINCIPAL DESKTOP */}
        <div style={{ 
          display: 'flex', 
          flex: 1,
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          padding: '24px',
          gap: '24px',
          overflow: 'hidden'
        }}>
          {/* SIDEBAR DESKTOP (toujours visible si connecté) */}
          {showSidebar && (
            <div style={{
              width: '280px',
              flexShrink: 0,
              position: 'sticky',
              top: '88px',
              height: 'calc(100vh - 112px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px var(--shadow-color)'
            }}>
              <Sidebar />
            </div>
          )}

          {/* CONTENU */}
          <main style={{
            flex: 1,
            minWidth: 0,
            color: 'var(--color-text-on-bg)',
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 'calc(100vh - 120px)'
          }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  // =========================================
  // 2. VERSION TABLETTE (768px - 1023px)
  // =========================================
  if (screenType === 'tablet') {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)'
      }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* NAVBAR TABLETTE */}
        {showNavbar && (
          <div style={{
            flexShrink: 0,
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            zIndex: 10
          }}>
            {/* BOUTON HOME */}
            <div style={{ width: '40px' }}>
              <HeaderHomeButton size={24} />
            </div>

            {/* LOGO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={logoImg} 
                alt="Logo" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  objectFit: 'cover', 
                  borderRadius: '50%' 
                }} 
              />
              <div style={{ 
                fontWeight: '800', 
                fontSize: '20px', 
                color: 'var(--color-text-main)' 
              }}>
                Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
              </div>
            </div>

            {/* HAMBURGER */}
            <div style={{ width: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                style={{ 
                  background: 'var(--bg-input)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Menu size={24} color="var(--color-text-main)" />
              </button>
            </div>
          </div>
        )}

        {/* CONTENU TABLETTE */}
        <div style={{ 
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          color: 'var(--color-text-on-bg)'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%'
          }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // 3. VERSION MOBILE (< 768px)
  // =========================================
  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* NAVBAR MOBILE */}
      {showNavbar && (
        <div style={{
          flexShrink: 0,
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          zIndex: 10
        }}>
          
          {/* BOUTON HOME */}
          <div style={{ width: '32px' }}>
            <HeaderHomeButton size={22} />
          </div>

          {/* LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src={logoImg} 
              alt="Logo" 
              style={{ 
                width: '28px', 
                height: '28px', 
                objectFit: 'cover', 
                borderRadius: '50%' 
              }} 
            />
            <div style={{ 
              fontWeight: '800', 
              fontSize: '17px', 
              color: 'var(--color-text-main)' 
            }}>
              Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
            </div>
          </div>

          {/* HAMBURGER */}
          <div style={{ width: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={{ 
                background: 'none', 
                border: 'none', 
                padding: 0, 
                cursor: 'pointer' 
              }}
            >
              <Menu size={22} color="var(--color-text-main)" />
            </button>
          </div>
        </div>
      )}

      {/* CONTENU MOBILE */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        padding: showNavbar ? '12px' : '0',
        color: 'var(--color-text-on-bg)'
      }}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;