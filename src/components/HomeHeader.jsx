// src/components/HomeHeader.jsx
import React, { useContext } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import HeaderHomeButton from './HeaderHomeButton';

const HomeHeader = ({ searchTerm, setSearchTerm, onNotificationClick }) => {
  const { user } = useContext(AuthContext);

  // Fonction pour vider la recherche proprement
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div style={{ 
      marginBottom: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px' 
    }}>
      
      {/* LIGNE DU HAUT : SALUTATION + CLOCHE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F', marginBottom: '4px' }}>
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#86868B', fontSize: '14px', fontWeight: '500' }}>
            Prêt à apprendre ?
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* BOUTON ADMIN (Visible seulement si admin) */}
          <HeaderHomeButton />

          {/* CLOCHE GOLD ANIMÉE */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ rotate: [0, -20, 20, -10, 10, 0] }} // Animation "Ding Dong"
            onClick={onNotificationClick}
            style={{
              position: 'relative',
              width: '48px', height: '48px',
              borderRadius: '16px',
              backgroundColor: '#FFF',
              border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <Bell size={22} color="#FFD700" fill="#FFD700" /> {/* JAUNE PLEIN */}
            
            {/* Indicateur point rouge (Optionnel: tu pourras le connecter au context plus tard) */}
            <span style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '8px', height: '8px',
              backgroundColor: '#FF3B30', borderRadius: '50%',
              border: '2px solid #FFF'
            }}></span>
          </motion.button>
        </div>
      </div>

      {/* BARRE DE RECHERCHE 1000x PLUS JOLIE */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ 
          position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
          color: '#86868B', pointerEvents: 'none'
        }}>
          <Search size={20} />
        </div>
        
        <input
          type="text"
          placeholder="Rechercher un cours, un sujet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 48px 16px 48px', // Place pour l'icone et la croix
            fontSize: '16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#F5F5F7', // Gris Apple
            color: '#1D1D1F',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: 'inset 0 0 0 1px transparent', // Pour l'animation de focus
          }}
          // Effet au focus via CSS-in-JS simulé
          onFocus={(e) => {
            e.target.style.backgroundColor = '#FFF';
            e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08), inset 0 0 0 2px var(--color-gold)';
          }}
          onBlur={(e) => {
            e.target.style.backgroundColor = '#F5F5F7';
            e.target.style.boxShadow = 'inset 0 0 0 1px transparent';
          }}
        />

        {/* CROIX DE FERMETURE (Apparaît si texte > 0) */}
        <AnimatePresence>
          {searchTerm.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              onClick={clearSearch}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                width: '24px', height: '24px',
                borderRadius: '50%',
                backgroundColor: '#C7C7CC',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFF'
              }}
            >
              <X size={14} strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomeHeader;