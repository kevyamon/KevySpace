import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Search, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CertificateModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  // Formulaire
  const [selectedUser, setSelectedUser] = useState(null);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  // Charger les utilisateurs pour la liste déroulante
  useEffect(() => {
    if (isOpen) {
      api.get('/api/auth/users').then(res => setUsers(res.data.data));
    }
  }, [isOpen]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !selectedUser) return toast.error("Tout est requis !");

    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', selectedUser._id);
    formData.append('title', title);
    formData.append('file', file);

    try {
      await api.post('/api/certificates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Certificat envoyé à ${selectedUser.name} !`);
      onClose();
      // Reset
      setTitle(''); setFile(null); setSelectedUser(null);
    } catch (err) {
      toast.error("Erreur envoi certificat");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(4px)' }} />
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', top: '50%', left: '50%', translate: '-50% -50%', width: '90%', maxWidth: '450px', background: '#FFF', padding: '24px', borderRadius: '24px', zIndex: 9999, height: '80vh', display:'flex', flexDirection:'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Décerner un Certificat</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>

            {/* ÉTAPE 1 : CHOISIR L'ÉLÈVE */}
            {!selectedUser ? (
              <div style={{ flex: 1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{background:'#F5F5F7', padding:'10px', borderRadius:'12px', display:'flex', gap:'8px', marginBottom:'12px'}}>
                    <Search size={20} color="#888"/>
                    <input autoFocus placeholder="Chercher un étudiant..." value={search} onChange={e => setSearch(e.target.value)} style={{border:'none', background:'transparent', outline:'none', width:'100%'}}/>
                </div>
                <div style={{overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
                    {filteredUsers.map(u => (
                        <button key={u._id} onClick={() => setSelectedUser(u)} style={{textAlign:'left', padding:'12px', borderRadius:'12px', border:'1px solid #EEE', background:'#FFF', cursor:'pointer', display:'flex', alignItems:'center', gap:'12px'}}>
                            <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'var(--color-gold)', color:'#FFF', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{u.name.charAt(0)}</div>
                            <div>
                                <div style={{fontWeight:'700', fontSize:'14px'}}>{u.name}</div>
                                <div style={{fontSize:'11px', color:'#888'}}>{u.email}</div>
                            </div>
                        </button>
                    ))}
                </div>
              </div>
            ) : (
              // ÉTAPE 2 : REMPLIR LE DIPLÔME
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{background:'#E5F9E5', padding:'12px', borderRadius:'12px', color:'#34C759', fontWeight:'600', fontSize:'14px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span>Pour : {selectedUser.name}</span>
                    <button type="button" onClick={() => setSelectedUser(null)} style={{background:'none', border:'none', color:'#34C759', textDecoration:'underline', cursor:'pointer', fontSize:'11px'}}>Changer</button>
                </div>

                <input type="text" placeholder="Titre (ex: Certificat React JS)" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E5E5EA', outline: 'none' }} />
                
                <div onClick={() => document.getElementById('certFile').click()} style={{ border: '2px dashed #E5E5EA', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', background: file ? '#FFF9E6' : 'transparent', borderColor: file ? '#FFD700' : '#E5E5EA' }}>
                  <input id="certFile" type="file" accept=".pdf,.png,.jpg" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                  {file ? <div style={{color:'#D4AF37', fontWeight:'bold'}}>{file.name}</div> : <div style={{color:'#888', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px'}}><Award size={32} color="#DDD"/> <span>Uploader le diplôme</span></div>}
                </div>

                <button type="submit" disabled={loading} style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-gold)', color: '#FFF', border: 'none', fontWeight: '700', cursor: 'pointer', marginTop:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {loading ? <Loader2 className="animate-spin"/> : "Envoyer le certificat"}
                </button>
              </form>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CertificateModal;