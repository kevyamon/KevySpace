// src/pages/admin/AdminCertificates.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Plus, Trash2, Loader2, User } from 'lucide-react';
import api from '../../services/api';
import CertificateModal from '../../components/admin/CertificateModal';
import toast from 'react-hot-toast';
import io from 'socket.io-client'; // <--- IMPORT SOCKET

// Connexion Socket (URL Render)
const socket = io('https://kevyspace-backend.onrender.com');

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

      // ÉCOUTE TEMPS RÉEL
      socket.on('certificate_action', (payload) => {
          // Si ajout : on l'ajoute en haut de liste
          if (payload.type === 'add') {
              // Comme le payload.data ne contient pas forcément le "user" populé (juste l'ID), 
              // on refait un fetch rapide pour avoir les noms corrects ou on gère manuellement.
              // Pour simplifier et garantir les données : on refetch tout (c'est léger pour l'admin)
              fetchCertificates(); 
              // Ou optimisé : setCertificates(prev => [payload.data, ...prev]) (mais il manquera le user.name)
          }

          // Si suppression : on filtre
          if (payload.type === 'delete') {
              setCertificates(prev => prev.filter(c => c._id !== payload.id));
          }
      });

      return () => {
          socket.off('certificate_action');
      };
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Révoquer ce certificat ? L'étudiant ne le verra plus.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/certificates/${id}`);
      toast.success("Certificat révoqué");
      // Note: Le socket se chargera de mettre à jour la liste visuellement
      // Mais pour une réactivité instantanée pour CELUI qui clique, on peut aussi filtrer ici
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