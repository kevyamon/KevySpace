// src/pages/admin/AdminCertificates.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Plus, Trash2, Loader2, User } from 'lucide-react';
import api from '../../services/api';
import CertificateModal from '../../components/admin/CertificateModal';
import toast from 'react-hot-toast';
import io from 'socket.io-client'; // <--- 1. IMPORT SOCKET

// 2. CONNEXION AU SERVEUR (Même URL que dans api.js)
const socket = io('https://kevyspace-backend.onrender.com');

const AdminCertificates = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCertificates = async () => {
    try {
      // Nouvelle route pour admin : voir TOUS les certificats
      const res = await api.get('/api/certificates/all');
      setCertificates(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    // Chargement initial
    fetchCertificates(); 

    // 3. ÉCOUTEUR D'ÉVÉNEMENTS (TEMPS RÉEL)
    const handleCertificateAction = (payload) => {
        if (payload.type === 'add') {
            // Option simple : on recharge tout pour avoir les données populées (nom, avatar...)
            fetchCertificates();
        }
        if (payload.type === 'delete') {
            setCertificates(prev => prev.filter(c => c._id !== payload.id));
        }
    };

    socket.on('certificate_action', handleCertificateAction);

    // Nettoyage à la fermeture du composant
    return () => {
        socket.off('certificate_action', handleCertificateAction);
    };
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Révoquer ce certificat ? L'étudiant ne le verra plus.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/certificates/${id}`);
      toast.success("Certificat révoqué");
      // Note : Le socket s'occupera de la mise à jour visuelle, 
      // mais on peut aussi le faire ici pour une réactivité immédiate locale
      setCertificates(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      toast.error("Erreur suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: '24px', paddingBottom:'100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft /></button>
        <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Gérer Certificats</h1>
      </div>

      {/* HEADER ACTION */}
      <div style={{ background: 'linear-gradient(135deg, #1D1D1F 0%, #333 100%)', borderRadius: '20px', padding: '24px', color: '#FFF', marginBottom: '32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Décerner un diplôme</h2>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Envoyez un certificat à un étudiant méritant.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ width:'48px', height:'48px', borderRadius:'14px', background:'var(--color-gold)', color:'#FFF', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.3)' }}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* LISTE DES CERTIFICATS DÉLIVRÉS */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color:'#1D1D1F' }}>Historique ({certificates.length})</h3>
      
      {loading ? <div style={{textAlign:'center'}}><Loader2 className='animate-spin'/></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {certificates.map(cert => (
                <div key={cert._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FFF', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F7', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'14px', fontWeight:'bold', overflow:'hidden' }}>
                           {/* Gestion Avatar améliorée */}
                            {cert.user?.avatar && cert.user.avatar !== 'no-photo.jpg' ? (
                                <img src={cert.user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="u" />
                            ) : (
                                cert.user?.name ? cert.user.name.charAt(0) : <User size={18}/>
                            )}
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '14px' }}>{cert.title}</div>
                            <div style={{ fontSize: '11px', color: '#888' }}>Pour : {cert.user?.name || 'Utilisateur supprimé'}</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => handleDelete(cert._id)}
                        disabled={deletingId === cert._id}
                        style={{ width:'36px', height:'36px', borderRadius:'8px', background:'#FFF0F0', color:'#FF3B30', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
                    >
                        {deletingId === cert._id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={18}/>}
                    </button>
                </div>
            ))}
            {certificates.length === 0 && <p style={{color:'#CCC', fontSize:'13px', textAlign:'center'}}>Aucun certificat distribué.</p>}
        </div>
      )}

      <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AdminCertificates;