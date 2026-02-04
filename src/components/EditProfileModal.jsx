// frontend/src/components/EditProfileModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User, Lock, Eye, EyeOff, LogOut, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('infos');
  const [loading, setLoading] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false); 
  
  // États Formulaires
  const [infoData, setInfoData] = useState({ name: '', email: '', phone: '' });
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

  // --- LOGIQUE DE RECONNEXION ---
  const handleReconnect = () => {
    logout(); 
    navigate('/login'); 
    onClose(); 
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/auth/updatedetails', infoData);
      setShowReconnect(true); 
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
      await api.put('/api/auth/updatepassword', passData);
      setShowReconnect(true); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur mot de passe");
    } finally {
      setLoading(false);
    }
  };

  // Si on est en mode "Reconnect", on affiche ce contenu spécifique
  const renderReconnectContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
      <motion.div 
        initial={{ scale: 0 }} animate={{ scale: 1 }} 
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', 
          backgroundColor: '#E5F9E5', color: '#34C759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px'
        }}
      >
        <CheckCircle size={32} />
      </motion.div>
      
      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1D1D1F', marginBottom: '8px' }}>
        Modifications enregistrées !
      </h3>
      
      <p style={{ fontSize: '14px', color: '#86868B', marginBottom: '24px', lineHeight: '1.5' }}>
        Veuillez vous déconnecter et vous reconnecter pour appliquer les changements en toute sécurité.
      </p>

      <button 
        onClick={handleReconnect}
        style={{ 
          width: '100%', padding: '16px', borderRadius: '16px',
          backgroundColor: 'var(--color-gold)', color: '#FFF', border: 'none',
          fontSize: '16px', fontWeight: '700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 8px 16px rgba(255, 215, 0, 0.3)'
        }}
      >
        <LogOut size={18} /> Se Reconnecter
      </button>
    </div>
  );

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
            initial={{ opacity: 0, scale: 0.95, y: '-40%', x: '-50%' }} // On commence un peu plus haut
            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }} // Centrage parfait
            exit={{ opacity: 0, scale: 0.95, y: '-40%', x: '-50%' }}
            style={{
              position: 'fixed', 
              top: '50%', 
              left: '50%', 
              width: '90%', 
              maxWidth: '400px',
              maxHeight: '85vh', // IMPORTANT : Limite la hauteur à 85% de l'écran
              overflowY: 'auto', // IMPORTANT : Active le scroll si ça dépasse (clavier ouvert)
              backgroundColor: '#FFF', 
              borderRadius: '24px', 
              padding: '24px', 
              zIndex: 99999,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              // Petit fix pour le scroll fluide sur iOS
              WebkitOverflowScrolling: 'touch' 
            }}
          >
            {/* Si showReconnect est vrai, on affiche l'écran de succès, sinon le formulaire */}
            {showReconnect ? renderReconnectContent() : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F' }}>Modifier le profil</h2>
                  <button onClick={onClose} style={{ background: '#F5F5F7', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={18} color="#1D1D1F" />
                  </button>
                </div>

                {/* ONGLETS */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#F5F5F7', padding: '4px', borderRadius: '14px' }}>
                  <TabButton active={activeTab === 'infos'} onClick={() => setActiveTab('infos')} icon={<User size={16} />} label="Infos" />
                  <TabButton active={activeTab === 'password'} onClick={() => setActiveTab('password')} icon={<Lock size={16} />} label="Sécurité" />
                </div>

                {/* FORMULAIRE INFOS */}
                {activeTab === 'infos' && (
                  <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <InputGroup label="Nom complet" value={infoData.name} onChange={e => setInfoData({...infoData, name: e.target.value})} />
                    <InputGroup label="Email" type="email" value={infoData.email} onChange={e => setInfoData({...infoData, email: e.target.value})} />
                    <InputGroup label="Téléphone" value={infoData.phone} onChange={e => setInfoData({...infoData, phone: e.target.value})} />
                    <SubmitButton loading={loading} label="Enregistrer les modifications" />
                  </form>
                )}

                {/* FORMULAIRE MOT DE PASSE */}
                {activeTab === 'password' && (
                  <form onSubmit={handlePassSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{position: 'relative'}}>
                      <InputGroup 
                        label="Mot de passe actuel" type={showPass ? "text" : "password"} 
                        value={passData.currentPassword} 
                        onChange={e => setPassData({...passData, currentPassword: e.target.value})} 
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', color: '#86868B' }}>
                        {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                      </button>
                    </div>
                    <InputGroup 
                      label="Nouveau mot de passe" type={showPass ? "text" : "password"} 
                      value={passData.newPassword} 
                      onChange={e => setPassData({...passData, newPassword: e.target.value})} 
                      placeholder="Min. 6 caractères"
                    />
                    <SubmitButton loading={loading} label="Changer le mot de passe" />
                  </form>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Petits composants internes
const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    type="button"
    onClick={onClick}
    style={{
      flex: 1, padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer',
      backgroundColor: active ? '#FFF' : 'transparent',
      color: active ? '#000' : '#86868B', fontWeight: '700', fontSize: '13px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      boxShadow: active ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
    }}
  >
    {icon} {label}
  </button>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', marginLeft: '4px', marginBottom: '4px', display:'block' }}>{label}</label>
    <input 
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E5E5EA', fontSize: '15px', outline: 'none', backgroundColor: '#FAFAFA' }}
    />
  </div>
);

const SubmitButton = ({ loading, label }) => (
  <button 
    type="submit" disabled={loading}
    style={{ 
      marginTop: '12px', padding: '16px', borderRadius: '16px',
      backgroundColor: '#1D1D1F', color: '#FFF', border: 'none',
      fontSize: '15px', fontWeight: '700', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
    }}
  >
    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {label}</>}
  </button>
);

export default EditProfileModal;