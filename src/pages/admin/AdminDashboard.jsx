// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Trash2, Video, Mail, Phone, Lock, Unlock, User } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import GlobalLoader from '../../components/GlobalLoader';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    action: null,
    data: null,
    title: '',
    message: '',
    isDanger: true,
    confirmText: 'Confirmer'
  });

  useEffect(() => {
    if (activeTab === 'videos') fetchVideos();
    else fetchUsers();
  }, [activeTab]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/videos');
      setVideos(res.data.data);
    } catch (err) { console.error("Erreur videos", err); }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/auth/users');
      setUsersList(res.data.data);
    } catch (err) { console.error("Erreur users", err); }
    setLoading(false);
  };

  const openDeleteVideoModal = (id) => {
    setModal({
      isOpen: true,
      action: 'deleteVideo',
      data: id,
      title: 'Supprimer le cours ?',
      message: 'Cette action est irréversible.',
      isDanger: true,
      confirmText: 'Supprimer'
    });
  };

  const openDeleteUserModal = (id) => {
    setModal({
      isOpen: true,
      action: 'deleteUser',
      data: id,
      title: 'Bannir l\'utilisateur ?',
      message: 'Cet utilisateur perdra l\'accès à son compte.',
      isDanger: true,
      confirmText: 'Bannir'
    });
  };

  const openBlockUserModal = (userToBlock) => {
    const isBlocking = !userToBlock.isBlocked;
    setModal({
      isOpen: true,
      action: 'blockUser',
      data: userToBlock,
      title: isBlocking ? 'Bloquer l\'accès ?' : 'Rétablir l\'accès ?',
      message: isBlocking 
        ? `Empêcher ${userToBlock.name} de se connecter ?`
        : `Autoriser ${userToBlock.name} à se reconnecter ?`,
      isDanger: isBlocking,
      confirmText: isBlocking ? 'Bloquer' : 'Débloquer'
    });
  };

  const handleConfirmAction = async () => {
    setModal({ ...modal, isOpen: false });
    const { action, data } = modal;
    const loadingToast = toast.loading('Traitement...');

    try {
      if (action === 'deleteVideo') {
        await api.delete(`/api/videos/${data}`);
        fetchVideos();
        toast.success('Vidéo supprimée !');
      } 
      else if (action === 'deleteUser') {
        await api.delete(`/api/auth/users/${data}`);
        fetchUsers();
        toast.success('Utilisateur banni !');
      } 
      else if (action === 'blockUser') {
        await api.put(`/api/auth/users/${data._id}/block`);
        fetchUsers();
        toast.success(data.isBlocked ? 'Utilisateur débloqué !' : 'Utilisateur bloqué !');
      }
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Une erreur est survenue");
    }
  };

  const getSecureUrl = (url) => {
    if (!url) return null;
    if (url === 'no-photo.jpg') return null;
    if (!url.startsWith('http')) return null;
    if (url.startsWith('http://')) return url.replace('http://', 'https://');
    return url;
  };

  return (
    <div style={{ padding: '24px 16px 60px 16px' }}>
      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={modal.title}
        message={modal.message}
        isDanger={modal.isDanger}
        confirmText={modal.confirmText}
      />

      {/* HEADER */}
      <div style={{ marginBottom: '24px', marginTop: '10px' }}>
        <h1 style={{ fontSize: '24px', color: 'var(--color-gold)', fontWeight: '800' }}>Dashboard Admin</h1>
        <p style={{ color: 'rgba(245, 243, 240, 0.5)', fontSize: '14px' }}>Command Center</p>
      </div>

      {/* TABS */}
      <div style={{ 
        display: 'flex', 
        backgroundColor: 'rgba(255, 255, 255, 0.08)', 
        padding: '4px', 
        borderRadius: '16px', 
        marginBottom: '32px',
        border: '1px solid rgba(255, 215, 0, 0.15)' 
      }}>
        <button 
          onClick={() => setActiveTab('videos')} 
          style={{ 
            flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', 
            backgroundColor: activeTab === 'videos' ? 'var(--color-gold)' : 'transparent', 
            color: activeTab === 'videos' ? 'var(--color-bg)' : 'rgba(245, 243, 240, 0.5)', 
            transition: 'all 0.2s ease', cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Vidéos
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', 
            backgroundColor: activeTab === 'users' ? 'var(--color-gold)' : 'transparent', 
            color: activeTab === 'users' ? 'var(--color-bg)' : 'rgba(245, 243, 240, 0.5)', 
            transition: 'all 0.2s ease', cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Utilisateurs
        </button>
      </div>

      {loading ? (
        <GlobalLoader text="Chargement des données..." />
      ) : (
        <>
          {/* ONGLET VIDÉOS */}
          {activeTab === 'videos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button fullWidth onClick={() => navigate('/admin/upload')}><Plus size={20} /> Nouveau cours</Button>
              {videos.map((video) => (
                <div key={video._id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={iconBoxStyle}>
                      <Video size={22} color="#FFD700" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ 
                        fontSize: '14px', fontWeight: '700', color: 'var(--color-text-on-bg-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>
                        {video.title}
                      </h3>
                    </div>
                  </div>
                  <button onClick={() => openDeleteVideoModal(video._id)} style={deleteBtnStyle}>
                    <Trash2 size={18} color="#FF3B30" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ONGLET UTILISATEURS */}
          {activeTab === 'users' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {usersList.map((usr) => {
                 const avatarUrl = getSecureUrl(usr.profilePicture);
                 
                 return (
                   <div key={usr._id} style={cardStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                         {/* AVATAR AVEC IMAGE DE PROFIL */}
                         <div style={{
                           ...iconBoxStyle, 
                           backgroundColor: avatarUrl ? 'transparent' : (usr.role === 'admin' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 215, 0, 0.15)'),
                           borderRadius: '50%',
                           overflow: 'hidden',
                           border: usr.role === 'admin' ? '2px solid var(--color-gold)' : '1px solid rgba(255, 215, 0, 0.25)'
                         }}>
                           {avatarUrl ? (
                             <img 
                               src={avatarUrl} 
                               alt={usr.name} 
                               crossOrigin="anonymous"
                               referrerPolicy="no-referrer"
                               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                               onError={(e) => { e.target.style.display = 'none'; }}
                             />
                           ) : (
                             <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '16px' }}>
                               {usr.name.charAt(0).toUpperCase()}
                             </span>
                           )}
                         </div>
                         
                         <div style={{ minWidth: 0, flex: 1 }}>
                           <h3 style={{ 
                             fontSize: '14px', fontWeight: '700', color: 'var(--color-text-on-bg-secondary)',
                             overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                           }}>
                             {usr.name}
                             {usr.role === 'admin' && (
                               <span style={{ 
                                 marginLeft: '6px', fontSize: '10px', 
                                 background: 'rgba(255, 215, 0, 0.2)', 
                                 padding: '2px 6px', borderRadius: '4px', 
                                 color: 'var(--color-gold)' 
                               }}>
                                 Admin
                               </span>
                             )}
                           </h3>
                           <p style={{ 
                             fontSize: '12px', color: 'rgba(245, 243, 240, 0.5)', 
                             overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                           }}>
                             {usr.email}
                           </p>
                           {usr.isBlocked && (
                             <span style={{ 
                               fontSize: '10px', color: '#FF3B30', fontWeight: '600',
                               background: 'rgba(255, 59, 48, 0.15)',
                               padding: '2px 6px', borderRadius: '4px'
                             }}>
                               Bloqué
                             </span>
                           )}
                         </div>
                      </div>

                      {/* ACTIONS (seulement si ce n'est pas soi-même) */}
                      {usr._id !== user._id && (
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '8px' }}>
                          <button 
                            onClick={() => openBlockUserModal(usr)} 
                            style={{
                              ...actionBtnStyle, 
                              background: usr.isBlocked ? 'rgba(255, 59, 48, 0.15)' : 'rgba(52, 199, 89, 0.15)',
                              border: usr.isBlocked ? '1px solid rgba(255, 59, 48, 0.25)' : '1px solid rgba(52, 199, 89, 0.25)'
                            }}
                          >
                            {usr.isBlocked ? <Lock size={16} color="#FF3B30"/> : <Unlock size={16} color="#34C759"/>}
                          </button>
                          <button onClick={() => openDeleteUserModal(usr._id)} style={deleteBtnStyle}>
                            <Trash2 size={16} color="#FF3B30" />
                          </button>
                        </div>
                      )}
                   </div>
                 );
               })}
             </div>
          )}
        </>
      )}
    </div>
  );
};

/* --- STYLES CONSTANTS --- */
const cardStyle = { 
  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
  padding: '14px 16px', 
  borderRadius: '16px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 215, 0, 0.1)',
  gap: '8px'
};

const iconBoxStyle = { 
  width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0, 
  backgroundColor: 'rgba(255, 215, 0, 0.15)', 
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '1px solid rgba(255, 215, 0, 0.25)' 
};

const actionBtnStyle = { 
  border: 'none', width: '34px', height: '34px', borderRadius: '10px', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
};

const deleteBtnStyle = { 
  background: 'rgba(255, 59, 48, 0.15)', 
  border: '1px solid rgba(255, 59, 48, 0.25)', 
  width: '34px', height: '34px', borderRadius: '10px', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
};

export default AdminDashboard;