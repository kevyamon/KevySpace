// src/components/HomeHeader.jsx
import React, { useContext } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationContext } from '../context/NotificationContext';

const HomeHeader = ({ user, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const { unreadCount } = useContext(NotificationContext); 

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
          <h1 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.2', color: 'var(--text-primary)' }}>
            Salut, <span style={{ color: 'var(--color-gold)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Qu'apprenons-nous aujourd'hui ?
          </p>
        </div>

        {/* BOUTON NOTIFICATION (JAUNE + ANIMÉ) */}
        <motion.button 
          whileTap={{ rotate: [0, -20, 20, 0] }} // Petite animation Ding-Dong
          onClick={() => navigate('/notifications')}
          style={{ 
            position: 'relative',
            background: 'var(--bg-surface)', // Fond dynamique
            border: '1px solid var(--border-color)', // Bordure dynamique
            borderRadius: '50%', 
            width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px var(--shadow-color)',
            cursor: 'pointer'
          }}
        >
          <Bell size={20} color="#FFD700" fill="#FFD700" /> {/* Jaune Or reste fixe */}
          
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '10px', right: '12px',
              width: '8px', height: '8px',
              backgroundColor: '#FF3B30',
              borderRadius: '50%',
              border: '1px solid var(--bg-surface)'
            }}></span>
          )}
        </motion.button>
      </div>

      {/* BARRE DE RECHERCHE "LIQUID GLASS" AMÉLIORÉE */}
      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', left: '16px', top: '50%', 
          transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)'
        }}>
          <Search size={18} />
        </div>
        
        <input 
          type="text"
          placeholder="Rechercher un module..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 40px 14px 48px', // Espace pour la croix à droite
            borderRadius: '16px',
            border: '1px solid var(--border-color)', // Bordure subtile
            backgroundColor: 'var(--bg-glass)', // Fond vitré dynamique (Noir/Blanc transparent)
            backdropFilter: 'blur(10px)', 
            boxShadow: '0 4px 20px var(--shadow-color)',
            fontSize: '15px',
            color: 'var(--text-primary)', // Texte dynamique
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
             e.target.style.boxShadow = '0 4px 25px rgba(255, 215, 0, 0.15)'; // Ombre dorée au focus
             e.target.style.borderColor = 'var(--color-gold)';
          }}
          onBlur={(e) => {
             e.target.style.boxShadow = '0 4px 20px var(--shadow-color)';
             e.target.style.borderColor = 'var(--border-color)';
          }}
        />

        {/* CROIX POUR VIDER (Apparaît si texte) */}
        <AnimatePresence>
            {searchQuery && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setSearchQuery('')}
                    style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        background: 'var(--bg-input)', // Fond bouton dynamique
                        border: 'none', borderRadius: '50%',
                        width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-secondary)'
                    }}
                >
                    <X size={12} />
                </motion.button>
            )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default HomeHeader;