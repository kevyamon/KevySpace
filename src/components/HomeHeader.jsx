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
          <h1 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.2', color: 'var(--color-text-on-bg-secondary)' }}>
            Salut, <span style={{ color: 'var(--color-gold)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(245, 243, 240, 0.6)', fontWeight: '500' }}>
            Qu'apprenons-nous aujourd'hui ?
          </p>
        </div>

        {/* BOUTON NOTIFICATION (JAUNE + ANIMÉ) */}
        <motion.button 
          whileTap={{ rotate: [0, -20, 20, 0] }}
          onClick={() => navigate('/notifications')}
          style={{ 
            position: 'relative',
            background: 'rgba(255, 215, 0, 0.15)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '50%', 
            width: '44px', height: '44px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer'
          }}
        >
          <Bell size={20} color="#FFD700" fill="#FFD700" />
          
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '10px', right: '12px',
              width: '8px', height: '8px',
              backgroundColor: '#FF3B30',
              borderRadius: '50%',
              border: '2px solid var(--color-bg)'
            }}></span>
          )}
        </motion.button>
      </div>

      {/* BARRE DE RECHERCHE ADAPTÉE AU FOND FONCÉ */}
      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', left: '16px', top: '50%', 
          transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(245, 243, 240, 0.4)'
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
            padding: '14px 40px 14px 48px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            fontSize: '15px',
            color: 'var(--color-text-on-bg-secondary)',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => {
             e.target.style.boxShadow = '0 4px 25px rgba(255, 215, 0, 0.2)';
             e.target.style.borderColor = 'var(--color-gold)';
             e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          }}
          onBlur={(e) => {
             e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
             e.target.style.borderColor = 'rgba(255, 215, 0, 0.2)';
             e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
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
                        background: 'rgba(255, 215, 0, 0.2)',
                        border: 'none', borderRadius: '50%',
                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--color-gold)'
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