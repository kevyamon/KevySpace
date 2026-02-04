import React, { useEffect, useState, useContext } from 'react';
import { Award, Lock, Download, Loader2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

// 1. Connexion simple au serveur Render
const socket = io('https://kevyspace-backend.onrender.com');

const Certificates = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();

    // 2. Écoute simple (comme Resources)
    socket.on('certificate_action', (payload) => {
      // On vérifie juste si c'est pour moi
      if (payload.targetUserId === user._id) {
        
        if (payload.type === 'add') {
          setCertificates(prev => [payload.data, ...prev]);
          toast.success("Nouveau certificat reçu ! 🎓");
        } 
        
        if (payload.type === 'delete') {
          setCertificates(prev => prev.filter(c => c._id !== payload.id));
        }
      }
    });

    return () => {
      socket.off('certificate_action');
    };
  }, [user._id]);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/api/certificates');
      setCertificates(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{height:'80vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin" color="var(--color-gold)" size={40} /></div>;

  return (
    <div style={{ padding: '24px 24px 100px 24px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.1)' }}>
          <Award size={24} color="#FFD700" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F', lineHeight: '1.2' }}>Mes Certificats</h1>
          <p style={{ fontSize: '13px', color: '#86868B' }}>Vos trophées de compétences ({certificates.length})</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '60px', textAlign: 'center', padding: '40px 20px', backgroundColor: '#FFF', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '24px', background: 'linear-gradient(135deg, #F5F5F7 0%, #FFF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E5EA' }}>
            <Lock size={40} color="#C7C7CC" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: '#1D1D1F' }}>Aucun certificat... pour l'instant !</h3>
          <p style={{ fontSize: '14px', color: '#86868B', lineHeight: '1.6', maxWidth: '300px' }}>Complétez vos formations pour débloquer vos certificats officiels.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          <AnimatePresence>
            {certificates.map((cert) => (
              <motion.div 
                key={cert._id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout 
                style={{ backgroundColor: '#FFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.02)' }}
              >
                <div style={{ height: '160px', backgroundColor: '#F5F5F7', position: 'relative', overflow:'hidden' }}>
                  {cert.fileUrl.endsWith('.pdf') ? (
                     <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#FFF9E6'}}><FileText size={50} color="#DAA520"/></div>
                  ) : (
                     <img src={cert.fileUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#1D1D1F' }}>{cert.title}</h3>
                  <p style={{ fontSize: '12px', color: '#86868B', marginBottom: '16px' }}>Obtenu le {new Date(cert.awardedAt).toLocaleDateString()}</p>
                  
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: '#1D1D1F', color: '#FFF', fontSize: '13px', fontWeight: '700', border: 'none', textDecoration:'none', transition:'transform 0.1s' }}>
                    <Download size={16} /> Télécharger
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
export default Certificates;