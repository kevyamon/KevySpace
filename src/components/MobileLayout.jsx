// frontend/src/components/MobileLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

// IMPORT DU LOGO
import logoImg from '../assets/logo.png';

// Hook pour détecter si on est sur mobile (simple check width)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const MobileLayout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Si on est sur PC, on affiche le layout classique avec Sidebar
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '280px', padding: '0' }}>
          <Outlet />
        </main>
      </div>
    );
  }

  // --- VERSION MOBILE ---
  
  // On cache le Header sur certaines pages (Login/Register/Lecture vidéo plein écran)
  const hideHeader = ['/login', '/register'].includes(location.pathname) || location.pathname.includes('/watch/');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', paddingBottom: '80px' }}> {/* Padding pour la nav bar du bas éventuelle */}
      
      {/* HEADER MOBILE (Sauf si caché) */}
      {!hideHeader && (
        <header 
          style={{ 
            position: 'sticky', top: 0, zIndex: 50, 
            backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={logoImg} alt="K" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
             </div>
             <span style={{ fontSize: '18px', fontWeight: '800', color: '#1D1D1F' }}>KevySpace</span>
          </div>
        </header>
      )}

      {/* CONTENU PRINCIPAL */}
      <main style={{ padding: '0' }}>
        <Outlet />
      </main>

      {/* NOTE : Ici tu pourrais ajouter une "Bottom Navigation Bar" fixe 
         si tu veux une navigation style appli mobile (Accueil, Recherche, Profil...) 
      */}
    </div>
  );
};

export default MobileLayout;