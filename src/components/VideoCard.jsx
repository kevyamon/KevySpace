// src/components/VideoCard.jsx
import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Eye, MessageCircle, Heart, Share2, Clock, Sparkles, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const VideoCard = ({ video, onClick }) => {
  const { user } = useContext(AuthContext);
  
  // États locaux synchronisés
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // --- 1. RECONNEXION FORCÉE ---
  // Dès que la props 'video' change (depuis Home ou Socket), on met à jour la carte
  useEffect(() => {
    if (video) {
      setLikesCount(video.likes ? video.likes.length : 0);
      // On vérifie si l'utilisateur a liké (si connecté)
      if (user && video.likes) {
        setIsLiked(video.likes.includes(user.id) || video.likes.includes(user._id));
      }
    }
  }, [video, user]);

  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(50); 
  };

  // --- 2. FIX DATE (Seulement createdAt) ---
  const isNew = (dateString) => {
    if (!dateString) return false;
    const created = new Date(dateString); // On utilise STRICTEMENT createdAt
    const now = new Date();
    const diffHours = Math.abs(now - created) / 36e5;
    return diffHours <= 24;
  };

  const isTrending = (views) => views >= 100;

  const handleLike = async (e) => {
    e.stopPropagation();
    triggerHaptic(); 

    if (!user) return toast.error("Connectez-vous pour aimer !");

    // Optimistic UI (Mise à jour immédiate)
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res = await api.put(`/api/videos/${video._id}/like`);
      // Le backend renvoie le tableau des likes à jour
      if (res.data && Array.isArray(res.data)) {
         setLikesCount(res.data.length);
         setIsLiked(res.data.includes(user.id) || res.data.includes(user._id));
      }
    } catch (err) {
      // Rollback en cas d'erreur
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Erreur réseau");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    triggerHaptic(); 
    const link = `${window.location.origin}/watch/${video._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien copié !");
  };

  const handleCardClick = () => {
    triggerHaptic(); 
    onClick();
  };

  const timeAgo = (dateString) => {
    if (!dateString) return "";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " an(s)";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " j";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " h";
    return "À l'instant";
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(255, 215, 0, 0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '12px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px 0 var(--shadow-color)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
        
        {/* THUMBNAIL */}
        <div style={{ 
          position: 'relative', width: '90px', height: '90px', borderRadius: '20px',
          background: '#000', overflow: 'hidden', flexShrink: 0,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #1D1D1F, #434343)', display:'flex', alignItems:'center', justifyContent:'center' }}>
             <PlayCircle size={32} color="#FFD700" fill="rgba(255,215,0,0.2)" />
          </div>

          {isNew(video.createdAt) && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: '0', left: '0',
                backgroundColor: '#FFD700', color: '#000', 
                fontSize: '9px', fontWeight: '800',
                padding: '4px 6px', 
                borderBottomRightRadius: '10px',
                display: 'flex', alignItems: 'center', gap: '2px'
              }}
            >
              <Sparkles size={8} fill="#000" /> NEW
            </motion.div>
          )}

          {isTrending(video.views) && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }} 
              style={{
                position: 'absolute', top: '0', right: '0',
                background: 'linear-gradient(45deg, #FF512F, #DD2476)', 
                color: '#FFF', 
                fontSize: '9px', fontWeight: '800',
                padding: '4px 6px', 
                borderBottomLeftRadius: '10px',
                display: 'flex', alignItems: 'center', gap: '2px',
                boxShadow: '0 2px 8px rgba(221, 36, 118, 0.4)'
              }}
            >
              <Flame size={8} fill="#FFF" /> HOT
            </motion.div>
          )}
        </div>

        {/* INFOS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.description || "Aucune description."}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Clock size={12} color="var(--text-secondary)" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {/* ICI : On utilise createdAt pour la date "Il y a X jours" */}
              {timeAgo(video.createdAt)} 
            </span>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '12px' }}></div>

      {/* FOOTER ACTIONS - NETTOYÉ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Gauche : Stats passives (Vues, Coms) - J'ai enlevé le coeur ici */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <StatBadge icon={<Eye size={14} />} count={video.views} />
          <StatBadge icon={<MessageCircle size={14} />} count={video.comments?.length} />
        </div>

        {/* Droite : Actions actives (Share, Like avec compteur intégré) */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton onClick={handleShare} icon={<Share2 size={18} />} />
          
          {/* BOUTON LIKE FUSIONNÉ (Icone + Compteur) */}
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            style={{ 
              height: '36px', borderRadius: '18px', padding: '0 12px',
              background: isLiked ? '#FFF0F0' : 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              cursor: 'pointer', 
              color: isLiked ? '#FF3B30' : 'var(--text-primary)',
              boxShadow: '0 2px 5px var(--shadow-color)'
            }}
          >
            <Heart size={18} fill={isLiked ? "#FF3B30" : "transparent"} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{likesCount}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Badge (Stats passives)
const StatBadge = ({ icon, count }) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', gap: '4px', 
    backgroundColor: 'var(--bg-input)', 
    padding: '4px 8px', borderRadius: '8px',
    border: '1px solid var(--border-color)'
  }}>
    <span style={{ color: 'var(--text-secondary)' }}>{icon}</span>
    <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '700' }}>
      {count || 0}
    </span>
  </div>
);

// Composant Bouton simple (Pour share)
const ActionButton = ({ onClick, icon }) => (
  <motion.button 
    whileTap={{ scale: 0.8 }}
    onClick={onClick}
    style={{ 
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'var(--bg-input)', 
      border: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      cursor: 'pointer', color: 'var(--text-primary)',
      boxShadow: '0 2px 5px var(--shadow-color)'
    }}
  >
    {icon}
  </motion.button>
);

export default VideoCard;