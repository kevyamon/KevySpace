// src/pages/Home.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoCard from '../components/VideoCard';
import HomeHeader from '../components/HomeHeader';
import { Loader2, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ScrollToTop from '../components/ScrollToTop'; // <--- 1. IMPORT

const Home = () => {
  const { setGlobalLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/api/videos');
        setVideos(res.data.data);
        setFilteredVideos(res.data.data);
      } catch (err) {
        setError("Impossible de charger les cours.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredVideos(videos);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(lower) ||
          (v.description && v.description.toLowerCase().includes(lower))
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="var(--color-gold)" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px', color: '#FF3B30' }}>
        <AlertCircle size={48} />
        <p style={{ marginTop: '10px', fontWeight: '600' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#1D1D1F', color: '#FFF' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh' }}>
      
      {/* HEADER AMÉLIORÉ (Barre + Cloche) */}
      <HomeHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onNotificationClick={() => navigate('/notifications')}
      />

      {/* FEED VIDÉOS */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px', color: '#1D1D1F' }}>
          {searchTerm ? `Résultats pour "${searchTerm}"` : 'Récemment ajoutés'}
        </h2>
        
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard 
              key={video._id} 
              video={video} 
              onClick={() => navigate(`/watch/${video._id}`)} 
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#86868B' }}>
            <p>Aucun cours trouvé 🕵️‍♂️</p>
          </div>
        )}
      </div>

      {/* BOUTON SCROLL TO TOP INTELLIGENT */}
      <ScrollToTop /> {/* <--- 2. PLACEMENT */}

    </div>
  );
};

export default Home;