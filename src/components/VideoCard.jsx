// src/components/VideoCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Eye, MessageCircle, Heart, Share2, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const VideoCard = ({ video, onClick }) => {
  const [isLiked, setIsLiked] = useState(false); // État local pour l'interaction immédiate

  // --- 1. FONCTIONS UTILITAIRES INTELLIGENTES ---

  // Formatter les gros chiffres (ex: 1250 -> 1.2k)
  const formatCount = (n) => {
    if (!n) return 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
  };

  // Calculer "Il y a X temps"
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " an(s)";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " j";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " h";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min";
    
    return "À l'instant";
  };

  // Détecter si "Nouveau" (< 3 jours)
  const isNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // --- 2. GESTIONNAIRES D'INTERACTIONS ---

  const handleLike = (e) => {
    e.stopPropagation(); // Ne pas ouvrir la vidéo
    setIsLiked(!isLiked);
    // Ici, on câblera l'API plus tard
    // toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(video.videoUrl);
    toast.success("Lien copié !", { icon: '🔗' });
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }} // Effet "Presse" iOS
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#FFF',
        borderRadius: '24px',
        padding: '12px',
        marginBottom: '20px',
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.06)', // Ombre "Premium"
        border: '1px solid rgba(0,0,0,0.03)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* --- ZONE SUPÉRIEURE : VIGNETTE & TITRE --- */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
        
        {/* VIGNETTE INTELLIGENTE */}
        <div style={{ 
          position: 'relative',
          width: '90px', height: '90px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #1D1D1F 0%, #434343 100%)', // Fond sombre classe
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
        }}>
          {/* Si image dispo, on l'affiche (pour l'instant placeholder dégradé) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(45deg, rgba(255,215,0,0.2), transparent)',
            zIndex: 1
          }}></div>
          
          <PlayCircle size={36} color="#FFD700" fill="rgba(255, 215, 0, 0.1)" style={{ zIndex: 2 }} />
          
          {/* BADGE "NOUVEAU" (Si récent) */}
          {isNew(video.createdAt) && (
            <div style={{
              position: 'absolute', top: '6px', left: '6px',
              backgroundColor: '#FF3B30', color: '#FFF',
              fontSize: '9px', fontWeight: '800',
              padding: '4px 8px', borderRadius: '8px',
              zIndex: 3, boxShadow: '0 2px 8px rgba(255, 59, 48, 0.4)',
              display: 'flex', alignItems: 'center', gap: '2px'
            }}>
              <Sparkles size={8} /> NEW
            </div>
          )}
        </div>

        {/* CONTENU TEXTUEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
          
          {/* Titre */}
          <h3 style={{ 
            fontSize: '16px', fontWeight: '800', 
            color: '#1D1D1F', lineHeight: '1.3',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {video.title}
          </h3>

          {/* Description courte */}
          <p style={{ 
            fontSize: '13px', color: '#86868B', fontWeight: '500',
            display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {video.description || "Aucune description disponible."}
          </p>

          {/* Date relative */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Clock size={12} color="#AAA" />
            <span style={{ fontSize: '11px', color: '#AAA', fontWeight: '600' }}>
              Il y a {timeAgo(video.createdAt || new Date())}
            </span>
          </div>
        </div>
      </div>

      {/* --- SÉPARATEUR SUBTIL --- */}
      <div style={{ height: '1px', backgroundColor: '#F5F5F7', marginBottom: '12px' }}></div>

      {/* --- ZONE INFÉRIEURE : STATS & ACTIONS --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* STATS (Vues & Coms) */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F9F9F9', padding: '6px 10px', borderRadius: '10px' }}>
            <Eye size={14} color="#86868B" />
            <span style={{ fontSize: '12px', color: '#1D1D1F', fontWeight: '700' }}>
              {formatCount(video.views || 0)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F9F9F9', padding: '6px 10px', borderRadius: '10px' }}>
            <MessageCircle size={14} color="#86868B" />
            <span style={{ fontSize: '12px', color: '#1D1D1F', fontWeight: '700' }}>
              {formatCount(video.comments?.length || 0)}
            </span>
          </div>
        </div>

        {/* BOUTONS ACTIONS (Cœur & Share) */}
        <div style={{ display: 'flex', gap: '8px' }}>
          
          {/* BOUTON PARTAGER */}
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleShare}
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#F5F5F7', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#1D1D1F'
            }}
          >
            <Share2 size={18} />
          </motion.button>

          {/* BOUTON LIKE (Cœur Animé) */}
          <motion.button 
            whileTap={{ scale: 0.8, rotate: [0, -10, 10, 0] }} // Petit "Shake" mignon
            onClick={handleLike}
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%',
              background: isLiked ? '#FFF0F0' : '#F5F5F7', // Fond rouge pâle si liké
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            <Heart 
              size={18} 
              color={isLiked ? "#FF3B30" : "#1D1D1F"} 
              fill={isLiked ? "#FF3B30" : "transparent"} // Remplissage rouge si liké
              style={{ transition: 'all 0.3s' }}
            />
          </motion.button>

        </div>

      </div>
    </motion.div>
  );
};

export default VideoCard;