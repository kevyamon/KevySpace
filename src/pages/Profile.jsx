// src/pages/Profile.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Edit2, LogOut, Camera, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  // Reset de l'erreur quand la photo change
  useEffect(() => {
    setImgError(false);
  }, [user?.profilePicture]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateSuccess = (updatedUser) => {
    window.location.reload();
  };

  // --- FONCTION DE SÉCURITÉ URL (CORRIGÉE) ---
  const getSecureUrl = (url) => {
    if (!url) return null;
    
    // 1. Si c'est le texte par défaut "no-photo.jpg", on le rejette (retourne null)
    if (url === 'no-photo.jpg') return null;

    // 2. Si ça ne ressemble pas à un lien web, on rejette
    if (!url.startsWith('http')) return null;

    // 3. Force HTTPS
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop lourde (max 5MB)");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    const loadingToast = toast.loading("Mise à jour de la photo...");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Non connecté", { id: loadingToast });
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'https://kevyspace-backend.onrender.com';
      
      const res = await axios.put(
        `${API_URL}/api/auth/profile-picture`, 
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        }
      );
      
      setUser(prev => ({ ...prev, ...res.data.user }));
      toast.success("Photo mise à jour !", { id: loadingToast });
      setImgError(false); 
    } catch (error) {
      console.error("Erreur Upload:", error);
      toast.error("Erreur lors de l'upload.", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  // On nettoie l'URL avant de l'utiliser
  const secureProfilePic = getSecureUrl(user?.profilePicture);

  return (
    <div style={{ padding: '20px 24px 100px 24px', minHeight: '100%' }}>
      
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#1D1D1F' }}>
        Mon Profil
      </h1>

      <div style={{ 
        backgroundColor: '#FFF', borderRadius: '24px', padding: '32px 24px',
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: '24px'
      }}>
        
        {/* PHOTO / AVATAR */}
        <div 
          style={{ position: 'relative', cursor: 'pointer', marginBottom: '16px' }}
          onClick={() => !uploading && fileInputRef.current.click()}
        >
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            backgroundColor: (secureProfilePic && !imgError) ? '#F5F5F7' : '#FFD700', 
            color: '#FFF',
            fontSize: '40px', fontWeight: '800', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
            border: '4px solid #FFF',
            overflow: 'hidden' 
          }}>
            {secureProfilePic && !imgError ? (
              <img 
                src={secureProfilePic} 
                alt="Profil" 
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  console.error("Échec affichage image. URL:", secureProfilePic); 
                  setImgError(true); 
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              initial
            )}
          </div>

          <div style={{
             position: 'absolute', inset: 0, borderRadius: '50%',
             backgroundColor: 'rgba(0,0,0,0.4)',
             display: 'flex', alignItems: 'center', justifyContent: 'center',
             opacity: uploading ? 1 : 0, 
             transition: 'opacity 0.2s',
          }}
          className="avatar-overlay"
          onMouseEnter={(e) => { if(!uploading) e.currentTarget.style.opacity = 1 }}
          onMouseLeave={(e) => { if(!uploading) e.currentTarget.style.opacity = 0 }}
          >
             {uploading ? <Loader className="spin" color="#FFF" /> : <Camera color="#FFF" size={24} />}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F', marginBottom: '4px' }}>
          {user?.name || 'Utilisateur'}
        </h2>
        <span style={{ 
          fontSize: '12px', fontWeight: '600', 
          color: user?.role === 'admin' ? '#FF3B30' : '#86868B',
          backgroundColor: user?.role === 'admin' ? '#FFF0F0' : '#F5F5F7',
          padding: '4px 12px', borderRadius: '20px'
        }}>
          {user?.role === 'admin' ? 'Administrateur' : 'Étudiant Certifié'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InfoItem icon={<User size={20} />} label="Nom complet" value={user?.name} />
        <InfoItem icon={<Mail size={20} />} label="Email" value={user?.email} />
        <InfoItem icon={<Phone size={20} />} label="Téléphone" value={user?.phone || 'Non renseigné'} />
        <InfoItem icon={<Shield size={20} />} label="Statut du compte" value="Actif" color="#34C759" />
      </div>

      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          onClick={() => setIsEditOpen(true)}
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', padding: '16px', borderRadius: '18px',
            backgroundColor: '#1D1D1F', color: '#FFF', border: 'none',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer'
          }}
        >
          <Edit2 size={18} /> Modifier mes informations
        </button>

        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            width: '100%', padding: '16px', borderRadius: '18px',
            backgroundColor: '#FFF0F0', color: '#FF3B30', border: '1px solid #FFE5E5',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer'
          }}
        >
          <LogOut size={18} /> Se déconnecter
        </button>
      </div>

      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        user={user}
        onUpdate={handleUpdateSuccess}
      />
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const InfoItem = ({ icon, label, value, color }) => (
  <div style={{ 
    backgroundColor: '#FFF', padding: '16px', borderRadius: '16px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #F9F9F9'
  }}>
    <div style={{ color: '#86868B' }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: '11px', color: '#86868B', marginBottom: '2px', fontWeight: '600' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: '700', color: color || '#1D1D1F' }}>{value}</p>
    </div>
  </div>
);

export default Profile;