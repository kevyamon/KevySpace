// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SearchX } from 'lucide-react'; // Plus besoin de Loader2
import api from '../services/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import HomeHeader from '../components/HomeHeader';
import VideoCard from '../components/VideoCard';

const Home = () => {
  // On récupère la commande setGlobalLoading
  const { user, setGlobalLoading } = useContext(AuthContext);
  
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. ON VERROUILLE L'ÉCRAN IMMÉDIATEMENT
    setGlobalLoading(true);
    
    fetchVideos();
    
    // Cleanup : sécurité pour être sûr que le loader part si on quitte la page vite
    return () => setGlobalLoading(false);
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/api/videos');
      setVideos(res.data.data);
    } catch (err) {
      console.error("Erreur chargement vidéos", err);
    } finally {
      // 2. ON LIBÈRE L'ÉCRAN (avec un petit délai pour la fluidité)
      setTimeout(() => {
        setGlobalLoading(false);
      }, 300);
    }
  };

  const handleWatchVideo = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '0 24px 100px 24px', minHeight: '100%' }}>
      
      <HomeHeader user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <h2 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '800', color: '#1D1D1F' }}>
        {searchQuery ? `Résultats pour "${searchQuery}"` : 'Récemment ajoutés'}
      </h2>

      {/* PLUS DE CHARGEMENT LOCAL ICI (Le GlobalLoader s'en occupe) */}
      
      {filteredVideos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginTop: '40px' }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchX size={32} color="#C7C7CC" />
          </div>
          <p style={{ textAlign: 'center', color: '#8E8E93', fontSize: '15px' }}>
            {searchQuery ? "Aucun module ne correspond à ta recherche." : "Aucune formation disponible pour le moment."}
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <VideoCard 
                video={video} 
                onClick={() => handleWatchVideo(video._id)} 
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;