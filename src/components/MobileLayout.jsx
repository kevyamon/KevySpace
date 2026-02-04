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
      height: '100dvh', /* Fixe la hauteur totale à l'écran */
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FAFAFA',
      overflow: 'hidden', /* Le cadre global ne scrolle JAMAIS */
      position: 'relative'
    }}>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* NAVBAR FIXE (Ne bouge pas) */}
      {showNavbar && (
        <div style={{
          flexShrink: 0, 
          height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 20px', backgroundColor: '#FFF', borderBottom: '1px solid #EEE',
          zIndex: 10 /* Reste au-dessus du contenu qui défile */
        }}>
          <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 0 }}>
            <Menu size={24} color="#1D1D1F" />
          </button>
          <div style={{ fontWeight: '800', fontSize: '18px' }}>
            Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
          </div>
          <div style={{ width: '24px' }}></div> 
        </div>
      )}

      {/* ZONE DE CONTENU (C'est elle qui scrolle !) */}
      <div style={{ 
        flex: 1, /* Prend tout l'espace restant sous la navbar */
        overflowY: 'auto', /* AUTORISE LE SCROLL VERTICAL ICI */
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        /* Pour un scroll fluide sur mobile */
        WebkitOverflowScrolling: 'touch' 
      }}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;