// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2, SearchX } from 'lucide-react'; // Icône pour recherche vide
import api from '../services/api';
import { motion } from 'framer-motion';

// IMPORT DES COMPOSANTS MODULAIRES
import HomeHeader from '../components/HomeHeader';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État de recherche local
  const [searchQuery, setSearchQuery] = useState('');

  // Chargement des données
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/api/videos');
      setVideos(res.data.data);
    } catch (err) {
      console.error("Erreur chargement vidéos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchVideo = (videoUrl) => {
    window.open(videoUrl, '_blank');
  };

  // LOGIQUE DE FILTRAGE (Recherche)
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '0 24px 100px 24px', minHeight: '100%' }}>
      
      {/* 1. HEADER (Recherche + Salut) */}
      <HomeHeader 
        user={user} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* 2. TITRE DE SECTION (Dynamique) */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '800', color: '#1D1D1F' }}>
        {searchQuery ? `Résultats pour "${searchQuery}"` : 'Récemment ajoutés'}
      </h2>

      {/* 3. CONTENU (Loading / Vide / Liste) */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Loader2 className="animate-spin" color="var(--color-gold)" size={32} />
        </div>
      ) : filteredVideos.length === 0 ? (
        
        // ETAT VIDE (Recherche ou Global)
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginTop: '40px' }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <SearchX size={32} color="#C7C7CC" />
          </div>
          <p style={{ textAlign: 'center', color: '#8E8E93', fontSize: '15px' }}>
            {searchQuery 
              ? "Aucun module ne correspond à ta recherche." 
              : "Aucune formation disponible pour le moment."}
          </p>
        </motion.div>

      ) : (
        
        // LISTE DES VIDÉOS (MAPPING SUR LE COMPOSANT)
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} // Effet cascade léger
            >
              <VideoCard 
                video={video} 
                onClick={() => handleWatchVideo(video.videoUrl)} 
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;