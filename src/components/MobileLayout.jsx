// src/components/MobileLayout.jsx
import React, { useState, useContext } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';

const MobileLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbar = ['/login', '/register', '/landing'].includes(location.pathname);
  const isPublicPage = !user && location.pathname === '/';
  const showNavbar = user && !hideNavbar && !isPublicPage;

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
          // On utilise 'space-between' pour placer les éléments
          justifyContent: 'space-between', 
          padding: '0 20px', backgroundColor: '#FFF', borderBottom: '1px solid #EEE',
          zIndex: 10 
        }}>
          
          {/* 1. ELEMENT INVISIBLE À GAUCHE (Pour équilibrer et centrer le logo) */}
          <div style={{ width: '24px' }}></div> 

          {/* 2. LOGO CENTRÉ */}
          <div style={{ fontWeight: '800', fontSize: '18px' }}>
            Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
          </div>

          {/* 3. HAMBURGER À DROITE (Enfin !) */}
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