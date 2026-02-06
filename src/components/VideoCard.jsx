// src/components/VideoCard.jsx
import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Eye, MessageCircle, Heart, Share2, Clock, Sparkles, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const VideoCard = ({ video, onClick }) => {
  const { user } = useContext(AuthContext);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (video) {
      setLikesCount(video.likes?.length || 0);
      setIsLiked(user && video.likes?.includes(user.id));
    }
  }, [video, user]);

  // --- LOGIQUE HAPTIQUE (VIBRATION) ---
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Vibration courte et sèche (50ms)
    }
  };

  // --- LOGIQUE BUSINESS ---
  const isNew = (dateString) => {
    const diffHours = Math.abs(new Date() - new Date(dateString)) / 36e5;
    return diffHours <= 24;
  };

  // Une vidéo est "Trending" si elle a plus de 100 vues (Ajuste ce chiffre selon ton trafic)
  const isTrending = (views) => views >= 100;

  const handleLike = async (e) => {
    e.stopPropagation();
    triggerHaptic(); // Bzzzt !

    if (!user) return toast.error("Connectez-vous pour aimer !");

    const previousLiked = isLiked;
    const previousCount = likesCount;
    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res = await api.put(`/api/videos/${video._id}/like`);
      if (res.data && Array.isArray(res.data)) {
         setLikesCount(res.data.length);
         setIsLiked(res.data.includes(user.id));
      }
    } catch (err) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Oups, erreur réseau.");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    triggerHaptic(); // Bzzzt !
    const link = `${window.location.origin}/watch/${video._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien copié !");
  };

  const handleCardClick = () => {
    triggerHaptic(); // Bzzzt !
    onClick();
  };

  const timeAgo = (dateString) => {
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
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        borderRadius: '24px',
        padding: '12px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
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

          {/* BADGE NEW (Haut Gauche) */}
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

          {/* BADGE TRENDING (Haut Droite) */}
          {isTrending(video.views) && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }} // Effet Respiration
              style={{
                position: 'absolute', top: '0', right: '0',
                background: 'linear-gradient(45deg, #FF512F, #DD2476)', // Dégradé Feu
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
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1D1D1F', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.title}
          </h3>
          <p style={{ fontSize: '13px', color: '#666', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.description || "Aucune description."}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Clock size={12} color="#AAA" />
            <span style={{ fontSize: '11px', color: '#AAA', fontWeight: '600' }}>
              {timeAgo(video.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', marginBottom: '12px' }}></div>

      {/* FOOTER ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <StatBadge icon={<Eye size={14} />} count={video.views} />
          <StatBadge icon={<MessageCircle size={14} />} count={video.comments?.length} />
          <StatBadge 
            icon={<Heart size={14} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "#666"} />} 
            count={likesCount} 
            active={isLiked}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ActionButton onClick={handleShare} icon={<Share2 size={18} />} />
          <ActionButton onClick={handleLike} active={isLiked} icon={<Heart size={18} fill={isLiked ? "#FF3B30" : "transparent"} color={isLiked ? "#FF3B30" : "#1D1D1F"} />} />
        </div>
      </div>
    </motion.div>
  );
};

const StatBadge = ({ icon, count, active }) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', gap: '4px', 
    backgroundColor: active ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255,255,255,0.5)', 
    padding: '4px 8px', borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.03)'
  }}>
    <span style={{ color: active ? '#FF3B30' : '#86868B' }}>{icon}</span>
    <span style={{ fontSize: '12px', color: active ? '#FF3B30' : '#1D1D1F', fontWeight: '700' }}>
      {count || 0}
    </span>
  </div>
);

const ActionButton = ({ onClick, icon, active }) => (
  <motion.button 
    whileTap={{ scale: 0.8 }}
    onClick={onClick}
    style={{ 
      width: '36px', height: '36px', borderRadius: '50%',
      background: active ? '#FFF0F0' : 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(0,0,0,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      cursor: 'pointer', color: '#1D1D1F',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }}
  >
    {icon}
  </motion.button>
);

export default VideoCard;