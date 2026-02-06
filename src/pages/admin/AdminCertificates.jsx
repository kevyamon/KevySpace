// frontend/src/pages/admin/AdminCertificates.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Plus, Trash2, Loader2, User } from 'lucide-react';
import api from '../../services/api';
import CertificateModal from '../../components/admin/CertificateModal';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const AdminCertificates = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/api/certificates/all');
      setCertificates(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchCertificates(); 

    const socket = io('https://kevyspace-backend.onrender.com');

    const handleCertificateAction = (payload) => {
        if (payload.type === 'add') {
            fetchCertificates();
        }
        if (payload.type === 'delete') {
            setCertificates(prev => prev.filter(c => c._id !== payload.id));
        }
    };

    socket.on('certificate_action', handleCertificateAction);

    return () => {
        socket.off('certificate_action', handleCertificateAction);
        socket.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Révoquer ce certificat ? L'étudiant ne le verra plus.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/certificates/${id}`);
      toast.success("Certificat révoqué");
    } catch (err) {
      toast.error("Erreur suppression");
      setDeletingId(null);
    } finally {
      if(deletingId) setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: '24px 16px 60px 16px' }}>
      {/* NAVIGATION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft color="var(--color-gold)" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-gold)' }}>Gérer Certificats</h1>
      </div>

      {/* HEADER ACTION */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.08) 100%)', 
        borderRadius: '20px', padding: '24px', 
        marginBottom: '32px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}>
        <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px', color: 'var(--color-text-on-bg-secondary)' }}>Décerner un diplôme</h2>
            <p style={{ fontSize: '12px', color: 'rgba(245, 243, 240, 0.6)' }}>Envoyez un certificat à un étudiant méritant.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            width: '48px', height: '48px', borderRadius: '14px', 
            background: 'var(--color-gold)', color: 'var(--color-bg)', 
            border: 'none', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' 
          }}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* LISTE DES CERTIFICATS DÉLIVRÉS */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--color-text-on-bg-secondary)' }}>
        Historique ({certificates.length})
      </h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Loader2 className="animate-spin" color="var(--color-gold)" size={32} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {certificates.map(cert => (
                <div key={cert._id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '16px', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  borderRadius: '16px', 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.1)' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                          background: 'rgba(255, 215, 0, 0.15)', 
                          color: 'var(--color-gold)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: '14px', fontWeight: 'bold', overflow: 'hidden',
                          border: '1px solid rgba(255, 215, 0, 0.25)' 
                        }}>
                           {cert.user?.avatar && cert.user.avatar !== 'no-photo.jpg' ? (
                                <img src={cert.user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="u" />
                            ) : (
                                cert.user?.name ? cert.user.name.charAt(0) : <User size={18}/>
                            )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ 
                              fontWeight: '700', fontSize: '14px', color: 'var(--color-text-on-bg-secondary)',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                            }}>
                              {cert.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(245, 243, 240, 0.5)' }}>
                              Pour : {cert.user?.name || 'Utilisateur supprimé'}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => handleDelete(cert._id)}
                        disabled={deletingId === cert._id}
                        style={{ 
                          width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                          background: 'rgba(255, 59, 48, 0.15)', color: '#FF3B30', 
                          border: '1px solid rgba(255, 59, 48, 0.25)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginLeft: '12px' 
                        }}
                    >
                        {deletingId === cert._id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={18}/>}
                    </button>
                </div>
            ))}
            {certificates.length === 0 && (
              <div style={{ 
                textAlign: 'center', padding: '40px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 215, 0, 0.1)'
              }}>
                <p style={{ color: 'rgba(245, 243, 240, 0.5)', fontSize: '13px' }}>
                  Aucun certificat distribué.
                </p>
              </div>
            )}
        </div>
      )}

      <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AdminCertificates;