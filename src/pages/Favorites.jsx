// src/pages/Favorites.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import VideoCard from '../components/VideoCard';
import { Heart, Loader2, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/api/videos');
      const allVideos = res.data.data;

      const favoriteVideos = allVideos.filter(video => 
        video.likes && video.likes.includes(user._id)
      );

      setVideos(favoriteVideos);
    } catch (err) {
      console.error("Erreur chargement favoris", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" color="var(--color-gold)" size={40} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 16px 60px 16px', minHeight: '100%' }}>
      
      {/* EN-TÊTE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '12px', 
          backgroundColor: 'rgba(255, 59, 48, 0.15)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255, 59, 48, 0.25)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}>
          <Heart size={24} color="#FF3B30" fill="#FF3B30" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-gold)' }}>Mes Favoris</h1>
      </div>

      {/* CONTENU */}
      {videos.length === 0 ? (
        /* ÉTAT VIDE */
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', marginTop: '60px', textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 59, 48, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            backgroundColor: 'rgba(255, 59, 48, 0.1)', 
            display: 'flex', alignItems: 'center', 
            justifyContent: 'center', marginBottom: '16px',
            border: '1px solid rgba(255, 59, 48, 0.2)' 
          }}>
            <Heart size={32} color="rgba(255, 59, 48, 0.5)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-on-bg-secondary)' }}>
            Aucun coup de cœur
          </h3>
          <p style={{ fontSize: '14px', maxWidth: '250px', lineHeight: '1.5', color: 'rgba(245, 243, 240, 0.6)' }}>
            Les vidéos que vous aimez apparaîtront ici pour un accès rapide.
          </p>
        </motion.div>
      ) : (
        /* LISTE DES FAVORIS */
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <VideoCard 
                video={video} 
                onClick={() => handleWatch(video._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;