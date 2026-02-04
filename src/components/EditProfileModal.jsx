import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('infos'); // 'infos' ou 'password'
  const [loading, setLoading] = useState(false);
  
  // États Infos
  const [infoData, setInfoData] = useState({ name: '', email: '', phone: '' });
  
  // États Mot de passe
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) {
      setInfoData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, isOpen]);

  // FONCTION MAGIQUE : Met à jour la mémoire du navigateur sans déconnexion
  const updateLocalStorage = (updatedUser) => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      // On écrase les anciennes données par les nouvelles
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/auth/updatedetails', infoData);
      
      // 1. Mise à jour immédiate
      updateLocalStorage(res.data.data);
      
      // 2. Notification et fermeture
      toast.success("Profil mis à jour !");
      onUpdate(res.data.data); // Le parent (Profile.jsx) va recharger la page
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur de mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passData.newPassword.length < 6) return toast.error("Le mot de passe doit faire 6 caractères min.");

    setLoading(true);
    try {
      const res = await api.put('/api/auth/updatepassword', passData);
      
      // Mise à jour du token si renvoyé
      if (res.data.user) updateLocalStorage(res.data.user);

      toast.success("Mot de passe modifié avec succès !");
      setPassData({ currentPassword: '', newPassword: '' });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* FOND */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 99998 }}
          />

          {/* MODALE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: 20, x: '-50%' }}
            style={{
              position: 'fixed', top: '50%', left: '50%', width: '90%', maxWidth: '400px',
              backgroundColor: '#FFF', borderRadius: '24px', padding: '24px', zIndex: 99999,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F' }}>Modifier le profil</h2>
              <button onClick={onClose} style={{ background: '#F5F5F7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="#1D1D1F" />
              </button>
            </div>

            {/* ONGLETS */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#F5F5F7', padding: '4px', borderRadius: '14px' }}>
              <button 
                onClick={() => setActiveTab('infos')}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'infos' ? '#FFF' : 'transparent', color: activeTab === 'infos' ? '#000' : '#86868B', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: activeTab === 'infos' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
              >
                <User size={16} /> Infos
              </button>
              <button 
                onClick={() => setActiveTab('password')}
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'password' ? '#FFF' : 'transparent', color: activeTab === 'password' ? '#000' : '#86868B', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: activeTab === 'password' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
              >
                <Lock size={16} /> Sécurité
              </button>
            </div>

            {/* CONTENU INFOS */}
            {activeTab === 'infos' && (
              <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', marginLeft: '4px' }}>Nom complet</label>
                  <input type="text" value={infoData.name} onChange={e => setInfoData({...infoData, name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E5E5EA', fontSize: '15px', backgroundColor: '#FAFAFA' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', marginLeft: '4px' }}>Email</label>
                  <input type="email" value={infoData.email} onChange={e => setInfoData({...infoData, email: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E5E5EA', fontSize: '15px', backgroundColor: '#FAFAFA' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', marginLeft: '4px' }}>Téléphone</label>
                  <input type="text" value={infoData.phone} onChange={e => setInfoData({...infoData, phone: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E5E5EA', fontSize: '15px', backgroundColor: '#FAFAFA' }} />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '12px', padding: '16px', borderRadius: '16px', backgroundColor: '#1D1D1F', color: '#FFF', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Enregistrer</>}
                </button>
              </form>
            )}

            {/* CONTENU MOT DE PASSE */}
            {activeTab === 'password' && (
              <form onSubmit={handlePassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', marginLeft: '4px' }}>Mot de passe actuel</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? "text" : "password"} value={passData.currentPassword} onChange={e => setPassData({...passData, currentPassword: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E5E5EA', fontSize: '15px', backgroundColor: '#FAFAFA' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#86868B' }}>
                      {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', marginLeft: '4px' }}>Nouveau mot de passe</label>
                  <input type={showPass ? "text" : "password"} value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E5E5EA', fontSize: '15px', backgroundColor: '#FAFAFA' }} placeholder="Min. 6 caractères" />
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: '12px', padding: '16px', borderRadius: '16px', backgroundColor: '#1D1D1F', color: '#FFF', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Changer le mot de passe</>}
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

export default EditProfileModal;