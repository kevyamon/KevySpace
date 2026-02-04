// src/components/HomeHeader.jsx
import React from 'react';
import { Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeHeader = ({ user, searchQuery, setSearchQuery }) => {
  return (
    <div style={{ marginBottom: '24px', paddingTop: '20px' }}>
      
      {/* LIGNE DU HAUT : SALUTATION + NOTIFICATIONS */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.2' }}>
            Salut, <span style={{ color: 'var(--color-gold)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#86868B', fontWeight: '500' }}>
            Qu'apprenons-nous aujourd'hui ?
          </p>
        </div>

        {/* BOUTON NOTIFICATION (Avec point rouge) */}
        <button style={{ 
          position: 'relative',
          background: '#FFF', 
          border: '1px solid rgba(0,0,0,0.05)', 
          borderRadius: '50%', 
          width: '44px', height: '44px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          cursor: 'pointer'
        }}>
          <Bell size={20} color="#1D1D1F" />
          
          {/* LE POINT ROUGE (Hardcodé pour l'instant, dynamique plus tard) */}
          <span style={{
            position: 'absolute', top: '10px', right: '12px',
            width: '8px', height: '8px',
            backgroundColor: '#FF3B30',
            borderRadius: '50%',
            border: '1px solid #FFF'
          }}></span>
        </button>
      </div>

      {/* BARRE DE RECHERCHE "LIQUID GLASS" */}
      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', left: '16px', top: '50%', 
          transform: 'translateY(-50%)', pointerEvents: 'none' 
        }}>
          <Search size={18} color="#86868B" />
        </div>
        
        <input 
          type="text"
          placeholder="Rechercher un module..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px', // Espace pour l'icône
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent
            backdropFilter: 'blur(10px)', // Effet flou arrière plan
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            fontSize: '15px',
            color: '#1D1D1F',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => e.target.style.boxShadow = '0 4px 25px rgba(255, 215, 0, 0.15)'}
          onBlur={(e) => e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'}
        />
      </div>

    </div>
  );
};

export default HomeHeader;