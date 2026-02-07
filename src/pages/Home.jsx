// src/pages/Home.jsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SearchX, ArrowUp } from 'lucide-react'; 
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

import HomeHeader from '../components/HomeHeader';
import VideoCard from '../components/VideoCard';
import RefreshButton from '../components/RefreshButton';

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggle = () => {
            const scrollable = document.querySelector('[data-scroll-container]');
            if (scrollable) {
                setVisible(scrollable.scrollTop > 300);
            } else {
                setVisible(window.scrollY > 300);
            }
        };
        const scrollable = document.querySelector('[data-scroll-container]');
        const target = scrollable || window;
        target.addEventListener('scroll', toggle);
        return () => target.removeEventListener('scroll', toggle);
    }, []);
    
    const handleScrollTop = useCallback(() => {
        const scrollable = document.querySelector('[data-scroll-container]');
        if (scrollable) {
            scrollable.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                    onClick={handleScrollTop}
                    style={{
                        position: 'fixed', bottom: '90px', right: '20px', zIndex: 99,
                        width: '45px', height: '45px', borderRadius: '50%',
                        background: 'var(--color-gold)',
                        color: 'var(--color-bg)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
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

  // =====================
  // SOCKET IO — TEMPS RÉEL VIDÉOS
  // =====================
  useEffect(() => {
    const socket = io('https://kevyspace-backend.onrender.com');

    const handleVideoAction = (payload) => {
      if (payload.type === 'add') {
        setVideos(prev => {
          const exists = prev.some(v => String(v._id) === String(payload.data._id));
          if (exists) return prev;
          return [payload.data, ...prev];
        });
        toast.success(`🎓 Nouveau cours : "${payload.data.title}"`, {
          duration: 5000,
          icon: '🆕'
        });
      }

      if (payload.type === 'delete') {
        setVideos(prev => prev.filter(v => String(v._id) !== String(payload.id)));
      }
    };

    socket.on('video_action', handleVideoAction);

    return () => {
      socket.off('video_action', handleVideoAction);
      socket.disconnect();
    };
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
    <div style={{ padding: '0 16px 40px 16px', minHeight: '100%' }}>
      
      <HomeHeader user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-gold)' }}>
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
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'rgba(255, 215, 0, 0.15)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <SearchX size={32} color="var(--color-gold)" />
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-text-on-bg-secondary)', fontSize: '15px' }}>
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