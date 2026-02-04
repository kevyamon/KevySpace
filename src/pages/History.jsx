// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoCard from '../components/VideoCard';
import { Clock, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/auth/history');
      setHistory(res.data.data);
    } catch (err) {
      console.error("Erreur historique", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" color="var(--color-gold)" size={40} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 24px 100px 24px', minHeight: '100%' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '12px', 
          backgroundColor: '#FFF5E5', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Clock size={24} color="#FFA500" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F' }}>Historique</h1>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.6 }}>
          <Clock size={48} color="#CCC" style={{ marginBottom: '16px' }} />
          <p>Vous n'avez pas encore regardé de vidéo.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {history.map((item, index) => (
            <motion.div
              key={index} // Ici l'index est sûr car l'ordre compte
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Note: item contient { video: {...}, watchedAt: "..." } */}
              {/* VideoCard attend un objet vidéo direct, donc on lui passe item.video */}
              <div style={{ position: 'relative' }}>
                <VideoCard 
                  video={item.video} 
                  onClick={() => navigate(`/watch/${item.video._id}`)} 
                />
                <div style={{ 
                  position: 'absolute', top: '16px', right: '16px', 
                  backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF',
                  fontSize: '10px', padding: '4px 8px', borderRadius: '8px',
                  backdropFilter: 'blur(4px)'
                }}>
                  Vu le {new Date(item.watchedAt).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;