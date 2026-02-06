// src/components/VideoInfo.jsx
import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoInfo = ({ video, viewsCount, likesCount, isLiked, onLike, onShare }) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Fonction Vibration
  const haptic = () => { if(navigator.vibrate) navigator.vibrate(50); };

  const handleLike = () => {
      haptic();
      onLike();
  };
  const handleShare = () => {
      haptic();
      onShare();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Titre */}
      <h1 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.3', marginBottom: '8px', color: 'var(--text-primary)' }}>
        {video?.title}
      </h1>

      {/* Stats (Vues, Likes, Date) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Eye size={14} /> {viewsCount.toLocaleString()} vues
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isLiked ? '#FF3B30' : 'var(--text-secondary)', fontWeight: isLiked ? '700' : '400' }}>
          <Heart size={14} fill={isLiked ? "#FF3B30" : "none"} /> {likesCount} likes
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} /> {new Date(video?.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* BARRE D'ACTIONS (CORRIGÉE : VISIBILITÉ MAXIMALE) */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <ActionButton 
          icon={<Heart size={20} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "var(--text-primary)"} />} 
          label={isLiked ? "Aimé" : "J'aime"} 
          onClick={handleLike} 
          active={isLiked} 
        />
        <ActionButton icon={<Share2 size={20} />} label="Partager" onClick={handleShare} />
        <ActionButton icon={<MessageCircle size={20} />} label={`${video?.comments?.length || 0}`} onClick={() => {}} />
      </div>

      {/* DESCRIPTION ACCORDÉON */}
      <div style={{ 
        backgroundColor: 'var(--bg-input)', // Fond légèrement grisé/sombre pour se détacher du fond de page
        border: '1px solid var(--border-color)', // Bordure subtile
        borderRadius: '16px', padding: '16px',
        marginBottom: '32px',
        maxHeight: isDescExpanded ? 'none' : '150px', // Plus compact par défaut
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}>
        <p style={{ fontWeight: '700', marginBottom: '8px', fontSize: '14px', color: 'var(--text-primary)' }}>Description</p>
        
        <div style={{ 
          fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)',
          display: isDescExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isDescExpanded ? 'none' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video?.description || "Aucune description pour ce cours."}
        </div>

        {/* Bouton Voir plus */}
        <button 
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          style={{ 
            display: 'block', width: '100%', textAlign: 'center',
            background: 'transparent', border: 'none', borderTop: '1px solid var(--border-color)',
            fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)',
            marginTop: '12px', paddingTop: '8px', cursor: 'pointer'
          }}
        >
          {isDescExpanded ? "▲ Réduire" : "▼ Lire la suite"}
        </button>
      </div>
    </div>
  );
};

// --- LE BOUTON CORRIGÉ ---
const ActionButton = ({ icon, label, onClick, active }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    style={{ 
      flex: 1, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
      padding: '12px', 
      borderRadius: '16px', 
      
      // 1. FOND : Surface (Blanc/Gris Foncé) ou Rouge pâle si actif
      backgroundColor: active ? 'rgba(255, 59, 48, 0.1)' : 'var(--bg-surface)', 
      
      // 2. BORDURE : Indispensable pour la visibilité sur fond blanc
      border: active ? '1px solid #FF3B30' : '1px solid var(--border-color)', 
      
      // 3. COULEUR TEXTE
      color: active ? '#FF3B30' : 'var(--text-primary)', 
      
      // 4. OMBRE : Pour le relief "Pop"
      boxShadow: '0 2px 6px var(--shadow-color)',
      
      fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' 
    }}
  >
    {icon} {label}
  </motion.button>
);

export default VideoInfo;