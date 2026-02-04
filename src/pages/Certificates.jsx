import React, { useEffect, useState } from 'react';
import { Award, Lock, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchCertificates();
  }, []);

  if (loading) return <div style={{height:'80vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin" /></div>;

  return (
    <div style={{ padding: '24px 24px 100px 24px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.1)' }}>
          <Award size={24} color="#FFD700" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F', lineHeight: '1.2' }}>Mes Certificats</h1>
          <p style={{ fontSize: '13px', color: '#86868B' }}>Vos trophées de compétences</p>
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
          {certificates.map((cert) => (
            <motion.div key={cert._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#FFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.02)' }}>
              <div style={{ height: '160px', backgroundColor: '#F5F5F7', position: 'relative' }}>
                {/* On affiche l'image si c'en est une, ou une icône si PDF */}
                {cert.fileUrl.endsWith('.pdf') ? (
                   <div style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}><FileText size={50} color="#999"/></div>
                ) : (
                   <img src={cert.fileUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#1D1D1F' }}>{cert.title}</h3>
                <p style={{ fontSize: '12px', color: '#86868B', marginBottom: '16px' }}>Obtenu le {new Date(cert.awardedAt).toLocaleDateString()}</p>
                <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '12px', backgroundColor: '#F5F5F7', color: '#1D1D1F', fontSize: '13px', fontWeight: '600', border: 'none', textDecoration:'none' }}>
                  <Download size={16} /> Télécharger
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Certificates;