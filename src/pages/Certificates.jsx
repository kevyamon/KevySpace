// frontend/src/pages/Certificates.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Award, Lock, Download, Loader2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const Certificates = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userIdRef = useRef(null);

  useEffect(() => {
    if (user) {
      userIdRef.current = String(user._id || user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchCertificates();

    const socket = io('https://kevyspace-backend.onrender.com');

    const handleCertificateAction = (payload) => {
      const myCurrentId = userIdRef.current;
      const targetId = String(payload.targetUserId || '').trim();

      if (myCurrentId && targetId === myCurrentId) {
        
        if (payload.type === 'add') {
          setCertificates(prev => [payload.data, ...prev]);
          toast.success("Nouveau certificat reçu ! 🎓", {
             duration: 5000,
             icon: '🏆'
          });
        } 
        
        if (payload.type === 'delete') {
          setCertificates(prev => prev.filter(c => String(c._id) !== String(payload.id)));
          toast('Un certificat a été révoqué.', { icon: 'ℹ️' });
        }
      }
    };

    socket.on('certificate_action', handleCertificateAction);

    return () => {
      socket.off('certificate_action', handleCertificateAction);
      socket.disconnect();
    };
  }, []); 

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

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" color="var(--color-gold)" size={40} />
    </div>
  );

  return (
    <div style={{ padding: '24px 16px 60px 16px', minHeight: '100%' }}>
      {/* EN-TÊTE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ 
          width: '44px', height: '44px', borderRadius: '14px', 
          backgroundColor: 'rgba(255, 215, 0, 0.15)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 215, 0, 0.25)' 
        }}>
          <Award size={24} color="#FFD700" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-gold)', lineHeight: '1.2' }}>Mes Certificats</h1>
          <p style={{ fontSize: '13px', color: 'rgba(245, 243, 240, 0.6)' }}>Vos trophées de compétences ({certificates.length})</p>
        </div>
      </div>

      {/* ÉTAT VIDE */}
      {certificates.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
            marginTop: '60px', textAlign: 'center', padding: '40px 20px', 
            backgroundColor: 'rgba(255, 255, 255, 0.06)', 
            borderRadius: '24px', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.1)' 
          }}
        >
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', marginBottom: '24px', 
            background: 'rgba(255, 215, 0, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            border: '1px solid rgba(255, 215, 0, 0.2)' 
          }}>
            <Lock size={40} color="rgba(255, 215, 0, 0.5)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--color-text-on-bg-secondary)' }}>
            Aucun certificat... pour l'instant !
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(245, 243, 240, 0.6)', lineHeight: '1.6', maxWidth: '300px' }}>
            Complétez vos formations pour débloquer vos certificats officiels.
          </p>
        </motion.div>
      ) : (
        /* GRILLE DE CERTIFICATS */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          <AnimatePresence>
            {certificates.map((cert) => (
              <motion.div 
                key={cert._id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)', 
                  border: '1px solid rgba(255, 215, 0, 0.15)' 
                }}
              >
                {/* PREVIEW IMAGE/PDF */}
                <div style={{ height: '160px', backgroundColor: 'rgba(255, 255, 255, 0.04)', position: 'relative', overflow: 'hidden' }}>
                  {cert.fileUrl?.endsWith('.pdf') ? (
                     <div style={{ 
                       height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                       background: 'rgba(255, 215, 0, 0.1)' 
                     }}>
                       <FileText size={50} color="#FFD700" />
                     </div>
                  ) : (
                     <img src={cert.fileUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>

                {/* INFOS */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: 'var(--color-text-on-bg-secondary)' }}>
                    {cert.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'rgba(245, 243, 240, 0.5)', marginBottom: '16px' }}>
                    Obtenu le {new Date(cert.awardedAt).toLocaleDateString()}
                  </p>
                  
                  {/* BOUTON TÉLÉCHARGER */}
                  <a 
                    href={cert.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                      padding: '12px', borderRadius: '12px', 
                      backgroundColor: 'var(--color-gold)', 
                      color: 'var(--color-bg)', 
                      fontSize: '13px', fontWeight: '700', 
                      border: 'none', textDecoration: 'none', 
                      transition: 'transform 0.1s',
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' 
                    }}
                  >
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