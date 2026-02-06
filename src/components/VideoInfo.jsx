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
      {/* Titre dynamique */}
      <h1 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.3', marginBottom: '8px', color: 'var(--text-primary)' }}>
        {video?.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
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

      {/* BARRE D'ACTIONS */}
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

      {/* DESCRIPTION INTELLIGENTE */}
      <div style={{ 
        backgroundColor: 'var(--bg-input)', // Fond dynamique (gris/sombre)
        borderRadius: '16px', padding: '16px',
        marginBottom: '32px',
        maxHeight: isDescExpanded ? 'none' : '250px', 
        overflow: 'hidden',
        transition: 'all 0.3s'
      }}>
        <p style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px', color: 'var(--text-primary)' }}>Description</p>
        <div style={{ 
          fontSize: '14px', lineHeight: '1.5', color: 'var(--text-secondary)', // Texte gris clair/foncé
          display: isDescExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isDescExpanded ? 'none' : 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video?.description || "Aucune description."}
        </div>
        <button 
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          style={{ 
            background: 'none', border: 'none', 
            fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)',
            marginTop: '8px', cursor: 'pointer', padding: 0
          }}
        >
          {isDescExpanded ? "▲ Réduire" : "▼ Tout afficher"}
        </button>
      </div>
    </div>
  );
};

// Bouton interne (Adapté Nuit)
const ActionButton = ({ icon, label, onClick, active }) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    style={{ 
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
      padding: '10px', borderRadius: '18px', border: 'none', 
      // Fond et couleur dynamiques
      backgroundColor: active ? '#FFF0F0' : 'var(--bg-input)', 
      color: active ? '#FF3B30' : 'var(--text-primary)', 
      fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' 
    }}
  >
    {icon} {label}
  </motion.button>
);

export default VideoInfo;