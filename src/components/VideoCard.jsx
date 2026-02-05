// src/components/VideoCard.jsx
import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Eye, MessageCircle, Heart, Share2, Clock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // On a besoin de l'API pour que le like soit réel

const VideoCard = ({ video, onClick }) => {
  const { user } = useContext(AuthContext);
  
  // États locaux pour gérer le Like instantané (Optimistic UI)
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Initialisation au chargement de la vidéo
  useEffect(() => {
    if (video) {
      setLikesCount(video.likes?.length || 0);
      // Vérifie si l'utilisateur a déjà liké (si connecté)
      if (user && video.likes?.includes(user.id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [video, user]);

  // --- 1. FONCTIONS UTILITAIRES ---
  const formatCount = (n) => {
    if (!n) return 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    // ... (Logique temporelle identique)
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

  const isNew = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // --- 2. GESTION DU LIKE (Cœur de la correction) ---
  const handleLike = async (e) => {
    e.stopPropagation(); // Stop l'ouverture de la vidéo
    
    if (!user) {
      toast.error("Connectez-vous pour aimer ce cours !");
      return;
    }

    // 1. Mise à jour OPTIMISTE (Immédiate pour l'utilisateur)
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      // 2. Appel API Réel
      const res = await api.put(`/api/videos/${video._id}/like`);
      
      // 3. Correction avec la vraie valeur du serveur (Source de vérité)
      if (res.data && Array.isArray(res.data)) {
         setLikesCount(res.data.length);
         // Vérif sécurité : est-ce que mon ID est bien dedans ?
         setIsLiked(res.data.includes(user.id));
      }
    } catch (err) {
      // 4. Si erreur, on annule tout (Rollback)
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Impossible de liker pour le moment.");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Copier le lien de la vidéo (ou de l'app si pas d'URL spécifique)
    const link = `${window.location.origin}/watch/${video._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien copié !", { icon: '🔗' });
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#FFF',
        borderRadius: '24px',
        padding: '12px',
        marginBottom: '20px',
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.03)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ZONE SUPÉRIEURE : VIGNETTE & TITRE */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
        <div style={{ 
          position: 'relative', width: '90px', height: '90px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #1D1D1F 0%, #434343 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(255,215,0,0.2), transparent)', zIndex: 1 }}></div>
          <PlayCircle size={36} color="#FFD700" fill="rgba(255, 215, 0, 0.1)" style={{ zIndex: 2 }} />
          {isNew(video.createdAt) && (
            <div style={{
              position: 'absolute', top: '6px', left: '6px',
              backgroundColor: '#FF3B30', color: '#FFF', fontSize: '9px', fontWeight: '800',
              padding: '4px 8px', borderRadius: '8px', zIndex: 3, boxShadow: '0 2px 8px rgba(255, 59, 48, 0.4)',
              display: 'flex', alignItems: 'center', gap: '2px'
            }}>
              <Sparkles size={8} /> NEW
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1D1D1F', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.title}
          </h3>
          <p style={{ fontSize: '13px', color: '#86868B', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.description || "Aucune description disponible."}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <Clock size={12} color="#AAA" />
            <span style={{ fontSize: '11px', color: '#AAA', fontWeight: '600' }}>
              Il y a {timeAgo(video.createdAt || new Date())}
            </span>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: '#F5F5F7', marginBottom: '12px' }}></div>

      {/* ZONE INFÉRIEURE : STATS & ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* STATS */}
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
          {/* NOUVEAU : Affichage du compteur de likes ICI aussi */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F9F9F9', padding: '6px 10px', borderRadius: '10px' }}>
             <Heart size={14} color={isLiked ? "#FF3B30" : "#86868B"} fill={isLiked ? "#FF3B30" : "none"} />
             <span style={{ fontSize: '12px', color: isLiked ? '#FF3B30' : '#1D1D1F', fontWeight: '700' }}>
                {formatCount(likesCount)}
             </span>
          </div>
        </div>

        {/* BOUTONS ACTIONS */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={handleShare}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F5F5F7', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1D1D1F' }}
          >
            <Share2 size={18} />
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.8, rotate: [0, -10, 10, 0] }}
            onClick={handleLike}
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%',
              background: isLiked ? '#FFF0F0' : '#F5F5F7',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.3s'
            }}
          >
            <Heart 
              size={18} 
              color={isLiked ? "#FF3B30" : "#1D1D1F"} 
              fill={isLiked ? "#FF3B30" : "transparent"} 
              style={{ transition: 'all 0.3s' }}
            />
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};

export default VideoCard;