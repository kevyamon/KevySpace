// src/components/MobileLayout.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import HeaderHomeButton from './HeaderHomeButton';
import logoImg from '../assets/logo.png'; 

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

const SIDEBAR_WIDTH = '280px';

const MobileLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const screenType = useScreenType();

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
        height: '100vh', 
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* HEADER DESKTOP — PLEINE LARGEUR */}
        {showNavbar && (
          <header style={{
            height: '64px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            flexShrink: 0,
            zIndex: 100,
            boxShadow: '0 2px 10px var(--shadow-color)'
          }}>
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

            <div>
              <HeaderHomeButton size={24} />
            </div>
          </header>
        )}

        {/* CORPS : SIDEBAR FIXE + CONTENU SCROLLABLE */}
        <div style={{ 
          display: 'flex', 
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* SIDEBAR FIXE — COLLÉE À GAUCHE */}
          {showSidebar && (
            <aside style={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              backgroundColor: 'var(--bg-surface)',
              borderRight: '1px solid var(--border-color)',
              boxShadow: '2px 0 20px var(--shadow-color)'
            }}>
              <Sidebar embedded />
            </aside>
          )}

          {/* CONTENU PRINCIPAL — SCROLLABLE */}
          <main style={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            color: 'var(--color-text-on-bg)'
          }}>
            <div style={{
              maxWidth: '1100px',
              margin: '0 auto',
              padding: '24px',
              width: '100%'
            }}>
              {children}
            </div>
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
            <div style={{ width: '40px' }}>
              <HeaderHomeButton size={24} />
            </div>

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
      width: '100%',
      height: '100dvh',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
          
          <div style={{ width: '32px' }}>
            <HeaderHomeButton size={22} />
          </div>

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

      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        padding: showNavbar ? '8px' : '0',
        color: 'var(--color-text-on-bg)'
      }}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;