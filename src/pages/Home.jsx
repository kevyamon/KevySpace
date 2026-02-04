// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Video as VideoIcon, Loader2, PlayCircle } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const { user } = useContext(AuthContext); // Plus besoin de logout ici
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      
      {/* HEADER : JUSTE LE TITRE (Plus de bouton logout qui traîne) */}
      <div style={{ 
        marginBottom: '32px',
        marginTop: '20px'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>
          Salut <span style={{ color: 'var(--color-gold-hover)' }}>{user?.name}</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          Prêt à apprendre ?
        </p>
      </div>

      {/* LISTE DES COURS */}
      <h2 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '700' }}>Mes Cours</h2>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Loader2 className="animate-spin" color="var(--color-gold)" size={32} />
        </div>
      ) : videos.length === 0 ? (
        // ETAT VIDE
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '50px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <VideoIcon size={32} color="#C7C7CC" />
          </div>
          <p style={{ textAlign: 'center', color: '#8E8E93' }}>
            Aucune formation disponible pour le moment.
          </p>
        </div>
      ) : (
        // LISTE DES VIDÉOS
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {videos.map((video) => (
            <div 
              key={video._id} 
              onClick={() => handleWatchVideo(video.videoUrl)}
              style={{ 
                backgroundColor: '#fff', 
                padding: '16px', 
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.1s ease'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* VIGNETTE */}
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '16px', 
                backgroundColor: 'var(--color-gold)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: '#FFF'
              }}>
                <PlayCircle size={28} fill="#FFF" color="var(--color-gold)" />
              </div>

              {/* INFOS */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1D1F', marginBottom: '4px' }}>
                  {video.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#8E8E93', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;