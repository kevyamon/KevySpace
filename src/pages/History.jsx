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
    <div style={{ padding: '24px 16px 60px 16px', minHeight: '100%' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '12px', 
          backgroundColor: 'rgba(255, 165, 0, 0.15)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255, 165, 0, 0.25)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' 
        }}>
          <Clock size={24} color="#FFA500" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-gold)' }}>Historique</h1>
      </div>

      {history.length === 0 ? (
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
            border: '1px solid rgba(255, 165, 0, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid rgba(255, 165, 0, 0.2)'
          }}>
            <Clock size={36} color="rgba(255, 165, 0, 0.5)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-on-bg-secondary)' }}>
            Aucun historique
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(245, 243, 240, 0.6)', lineHeight: '1.5', maxWidth: '280px' }}>
            Vous n'avez pas encore regardé de vidéo.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div style={{ position: 'relative' }}>
                <VideoCard 
                  video={item.video} 
                  onClick={() => navigate(`/watch/${item.video._id}`)} 
                />
                <div style={{ 
                  position: 'absolute', top: '16px', right: '16px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', color: '#FFF',
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