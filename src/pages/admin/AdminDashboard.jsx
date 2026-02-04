import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Trash2, Video, LogOut, Loader2, Mail, Phone, Lock, Unlock } from 'lucide-react';
import Button from '../../components/Button';
import toast from 'react-hot-toast'; // IMPORT TOAST
import ConfirmModal from '../../components/ConfirmModal'; // IMPORT MODAL

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ÉTAT POUR LE MODAL (Est-il ouvert ? Pour faire quoi ? Sur qui ?)
  const [modal, setModal] = useState({
    isOpen: false,
    action: null,   // 'deleteVideo', 'deleteUser', 'blockUser'
    data: null,     // L'ID ou l'objet User
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

  // --- 1. FONCTIONS QUI OUVRENT LE MODAL ---

  const openDeleteVideoModal = (id) => {
    setModal({
      isOpen: true,
      action: 'deleteVideo',
      data: id,
      title: 'Supprimer le cours ?',
      message: 'Cette action est irréversible. La vidéo sera effacée définitivement.',
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
      message: 'Cet utilisateur perdra l\'accès à son compte et à ses données.',
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
        ? `Voulez-vous empêcher ${userToBlock.name} de se connecter temporairement ?`
        : `Voulez-vous autoriser ${userToBlock.name} à se reconnecter ?`,
      isDanger: isBlocking, // Rouge si on bloque, Vert si on débloque
      confirmText: isBlocking ? 'Bloquer' : 'Débloquer'
    });
  };

  // --- 2. FONCTION EXÉCUTÉE QUAND ON CLIQUE SUR "CONFIRMER" ---

  const handleConfirmAction = async () => {
    setModal({ ...modal, isOpen: false }); // On ferme le modal

    const { action, data } = modal;
    const loadingToast = toast.loading('Traitement en cours...');

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

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* LE MODAL (Invisible tant que isOpen = false) */}
      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={modal.title}
        message={modal.message}
        isDanger={modal.isDanger}
        confirmText={modal.confirmText}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-gold)' }}>Dashboard Admin</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>Command Center</p>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut color="#FF3B30" size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', backgroundColor: '#E5E5EA', padding: '4px', borderRadius: '16px', marginBottom: '32px' }}>
        <button onClick={() => setActiveTab('videos')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', backgroundColor: activeTab === 'videos' ? '#fff' : 'transparent', color: activeTab === 'videos' ? '#000' : '#8E8E93', transition: 'all 0.2s ease', cursor: 'pointer' }}>Vidéos</button>
        <button onClick={() => setActiveTab('users')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', backgroundColor: activeTab === 'users' ? '#fff' : 'transparent', color: activeTab === 'users' ? '#000' : '#8E8E93', transition: 'all 0.2s ease', cursor: 'pointer' }}>Utilisateurs</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><Loader2 className="animate-spin" color="var(--color-gold)" size={32} /></div>
      ) : (
        <>
          {activeTab === 'videos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Button fullWidth onClick={() => navigate('/admin/upload')}><Plus size={20} /> Nouveau cours</Button>
              {videos.map((video) => (
                <div key={video._id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={iconBoxStyle}><Video size={24} color="#1D1D1F" /></div>
                    <div><h3 style={{ fontSize: '16px', fontWeight: '600' }}>{video.title}</h3></div>
                  </div>
                  {/* ON APPELLE LA FONCTION D'OUVERTURE DU MODAL */}
                  <button onClick={() => openDeleteVideoModal(video._id)} style={deleteBtnStyle}><Trash2 size={18} color="#FF3B30" /></button>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'users' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {usersList.map((usr) => (
                 <div key={usr._id} style={cardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                       <div style={{...iconBoxStyle, backgroundColor: usr.role==='admin'?'#FFD700':'#E5E5EA'}}><span style={{fontWeight:'bold'}}>{usr.name.charAt(0)}</span></div>
                       <div><h3 style={{fontSize:'16px', fontWeight:'600'}}>{usr.name}</h3><p style={{fontSize:'12px', color:'#666'}}>{usr.email}</p></div>
                    </div>
                    {usr._id !== user._id && (
                      <div style={{display:'flex', gap:'8px'}}>
                        {/* ON APPELLE LES FONCTIONS D'OUVERTURE DU MODAL */}
                        <button onClick={() => openBlockUserModal(usr)} style={{...deleteBtnStyle, background: usr.isBlocked ? '#FFE5E5' : '#E5F9E5'}}>{usr.isBlocked ? <Lock size={18} color="#D00"/> : <Unlock size={18} color="#0D0"/>}</button>
                        <button onClick={() => openDeleteUserModal(usr._id)} style={deleteBtnStyle}><Trash2 size={18} color="#FF3B30" /></button>
                      </div>
                    )}
                 </div>
               ))}
             </div>
          )}
        </>
      )}
    </div>
  );
};

const cardStyle = { backgroundColor: '#fff', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' };
const iconBoxStyle = { width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0, backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const deleteBtnStyle = { background: '#FFE5E5', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

export default AdminDashboard;