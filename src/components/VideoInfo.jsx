// src/components/VideoInfo.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ThumbsUp, MessageCircle, Share2, Calendar, 
  Eye, ChevronDown, ChevronUp, CheckCircle2 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // On a besoin de l'API
import toast from 'react-hot-toast';

const VideoInfo = ({ video }) => {
  const { user } = useContext(AuthContext);
  const [showDescription, setShowDescription] = useState(false);
  
  // --- 1. ÉTATS INTELLIGENTS ---
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // --- 2. SYNCHRONISATION INITIALE ---
  useEffect(() => {
    if (video) {
      setLikesCount(video.likes?.length || 0);
      if (user && video.likes?.includes(user.id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [video, user]);

  // --- 3. LOGIQUE OPTIMISTE (La même que VideoCard) ---
  const handleLike = async () => {
    if (!user) return toast.error("Connectez-vous pour aimer !");

    // A. On change l'affichage TOUT DE SUITE (On triche pour l'utilisateur)
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      // B. On envoie la requête en arrière-plan
      const res = await api.put(`/api/videos/${video._id}/like`);
      
      // C. On confirme avec les vraies données du serveur
      if (res.data && Array.isArray(res.data)) {
        setLikesCount(res.data.length);
        setIsLiked(res.data.includes(user.id));
      }
    } catch (err) {
      // D. Si ça plante, on revient en arrière (Rollback)
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Erreur lors du like");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Lien copié dans le presse-papier !');
  };

  if (!video) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      
      {/* TITRE & DATE */}
      <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F', lineHeight: '1.3', marginBottom: '8px' }}>
        {video.title}
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#86868B', marginBottom: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Eye size={14} /> {video.views} vues
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} /> {new Date(video.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* BARRE D'ACTIONS (LIKE, SHARE) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        
        {/* LE BOUTON LIKE INTELLIGENT */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '20px',
              border: 'none', cursor: 'pointer',
              // Style conditionnel (Jaune si liké, Gris si neutre)
              backgroundColor: isLiked ? 'rgba(255, 215, 0, 0.15)' : '#F5F5F7',
              color: isLiked ? '#B39ddb' : '#1D1D1F', // Note: Le jaune sur fond blanc est dur à lire, j'utilise un ton foncé ou noir pour le texte
            }}
          >
            <ThumbsUp 
              size={20} 
              fill={isLiked ? "#FFD700" : "none"} // Remplissage Or
              color={isLiked ? "#FFD700" : "#1D1D1F"} // Contour Or ou Noir
            />
            <span style={{ fontWeight: '700', color: isLiked ? '#000' : '#1D1D1F' }}>
              {likesCount}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '20px',
              border: 'none', cursor: 'pointer', backgroundColor: '#F5F5F7', color: '#1D1D1F'
            }}
          >
            <Share2 size={20} />
            <span style={{ fontWeight: '600' }}>Partager</span>
          </motion.button>
        </div>
      </div>

      {/* DESCRIPTION ACCORDÉON (Style Glass léger) */}
      <motion.div 
        layout
        style={{ 
          backgroundColor: '#FAFAFA', 
          borderRadius: '20px', 
          padding: '16px',
          border: '1px solid rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
        onClick={() => setShowDescription(!showDescription)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '14px', color: '#1D1D1F' }}>Description</span>
          {showDescription ? <ChevronUp size={18} color="#86868B"/> : <ChevronDown size={18} color="#86868B"/>}
        </div>
        
        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#424245', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {video.description || "Aucune description fournie pour ce cours."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};

export default VideoInfo;