// src/components/VideoCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Eye, MessageCircle, Heart } from 'lucide-react';

const VideoCard = ({ video, onClick }) => {
  
  // Formatage des gros chiffres (1200 -> 1.2k)
  const formatCount = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }} // Petit effet de presse tactile
      onClick={onClick}
      style={{
        backgroundColor: '#FFF',
        borderRadius: '24px', // Arrondi prononcé iOS
        padding: '12px',
        marginBottom: '16px',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.08)', // Ombre douce et diffuse
        border: '1px solid rgba(0,0,0,0.02)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 1. ZONE VIGNETTE & TITRE */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        
        {/* Vignette (Placeholder intelligent) */}
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, 
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
        }}>
          <PlayCircle size={32} color="#FFF" fill="rgba(0,0,0,0.1)" />
        </div>

        {/* Textes */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ 
            fontSize: '16px', fontWeight: '700', 
            color: '#1D1D1F', marginBottom: '6px',
            lineHeight: '1.3'
          }}>
            {video.title}
          </h3>
          <p style={{ 
            fontSize: '13px', color: '#86868B', 
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            lineHeight: '1.4'
          }}>
            {video.description || "Aucune description disponible pour ce module."}
          </p>
        </div>
      </div>

      {/* 2. BARRE D'ACTIONS & STATS (Séparateur subtil) */}
      <div style={{ 
        borderTop: '1px solid #F5F5F7', 
        paddingTop: '12px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
      }}>
        
        {/* Stats à gauche */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#86868B', fontWeight: '600' }}>
            <Eye size={14} />
            {formatCount(video.views || 0)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#86868B', fontWeight: '600' }}>
            <MessageCircle size={14} />
            {formatCount(video.comments?.length || 0)}
          </div>
        </div>

        {/* Bouton Favoris (Cœur) */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Empêche d'ouvrir la vidéo quand on like
            // Ici on branchera la logique de like plus tard
            console.log('Like clicked');
          }}
          style={{ 
            background: 'none', border: 'none', 
            display: 'flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Heart size={18} color="#86868B" />
        </button>

      </div>
    </motion.div>
  );
};

export default VideoCard;