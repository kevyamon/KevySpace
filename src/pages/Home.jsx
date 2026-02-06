// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SearchX, ArrowUp } from 'lucide-react'; 
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import HomeHeader from '../components/HomeHeader';
import VideoCard from '../components/VideoCard';
import RefreshButton from '../components/RefreshButton';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggle = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggle);
        return () => window.removeEventListener('scroll', toggle);
    }, []);
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        position: 'fixed', bottom: '90px', right: '20px', zIndex: 99,
                        width: '45px', height: '45px', borderRadius: '50%',
                        background: 'var(--color-text-main)',
                        color: 'var(--color-bg)',
                        border: 'none',
                        boxShadow: '0 4px 12px var(--shadow-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

const Home = () => {
  const { user, setGlobalLoading } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalLoading(true);
    fetchVideos();
    return () => setGlobalLoading(false);
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/api/videos');
      setVideos(res.data.data);
    } catch (err) {
      console.error("Erreur chargement vidéos", err);
    } finally {
      setTimeout(() => {
        setGlobalLoading(false);
        setRefreshing(false);
      }, 300);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVideos();
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)' }}>
          {searchQuery ? `Résultats pour "${searchQuery}"` : 'Récemment ajoutés'}
        </h2>
        
        <RefreshButton 
          onClick={handleRefresh} 
          refreshing={refreshing} 
        />
      </div>

      {filteredVideos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginTop: '40px' }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SearchX size={32} color="var(--color-text-secondary)" />
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '15px' }}>
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
      
      <ScrollToTopButton />
    </div>
  );
};

export default Home;