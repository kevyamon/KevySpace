// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Video as VideoIcon, Plus } from 'lucide-react';
import Button from '../components/Button';

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      
      {/* HEADER : SALUTATION + LOGOUT */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px',
        marginTop: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>
            Salut <span style={{ color: 'var(--color-gold-hover)' }}>{user?.name}</span> 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Prêt à apprendre ?
          </p>
        </div>
        <button 
          onClick={logout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
        >
          <LogOut color="#FF3B30" size={24} />
        </button>
      </div>

      {/* SECTION VIDÉOS (VIDE POUR L'INSTANT) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '50px' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <VideoIcon size={32} color="#C7C7CC" />
        </div>
        <p style={{ textAlign: 'center', color: '#8E8E93' }}>
          Aucune formation disponible pour le moment.
        </p>
        
        {/* BOUTON ADMIN (Visible seulement si Admin) */}
        {user?.role === 'admin' && (
           <Button>
             <Plus size={20} /> Ajouter une vidéo
           </Button>
        )}
      </div>

    </div>
  );
};

export default Home;