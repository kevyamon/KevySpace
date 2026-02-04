import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Trash2, Video, LogOut, Loader2, Users, Phone, Mail } from 'lucide-react';
import Button from '../../components/Button';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Gestion des onglets ('videos' ou 'users')
  const [activeTab, setActiveTab] = useState('videos');
  
  const [videos, setVideos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  // CHARGEMENT DES DONNÉES SELON L'ONGLET
  useEffect(() => {
    if (activeTab === 'videos') fetchVideos();
    else fetchUsers();
  }, [activeTab]);

  // --- API CALLS ---
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://kevyspace-backend.onrender.com/api/videos');
      setVideos(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://kevyspace-backend.onrender.com/api/auth/users', { withCredentials: true });
      setUsersList(res.data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDeleteVideo = async (id) => {
    if(!window.confirm("Supprimer cette vidéo ?")) return;
    try {
      await axios.delete(`https://kevyspace-backend.onrender.com/api/videos/${id}`, { withCredentials: true });
      fetchVideos();
    } catch (err) { alert("Erreur suppression"); }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("BANNIR cet utilisateur définitivement ?")) return;
    try {
      await axios.delete(`https://kevyspace-backend.onrender.com/api/auth/users/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (err) { alert("Erreur suppression"); }
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: 'var(--color-gold)' }}>Dashboard Admin</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>Command Center</p>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut color="#FF3B30" size={24} />
        </button>
      </div>

      {/* SYSTÈME D'ONGLETS (SWITCHER) */}
      <div style={{ display: 'flex', backgroundColor: '#E5E5EA', padding: '4px', borderRadius: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('videos')}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600',
            backgroundColor: activeTab === 'videos' ? '#fff' : 'transparent',
            color: activeTab === 'videos' ? '#000' : '#8E8E93',
            boxShadow: activeTab === 'videos' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease', cursor: 'pointer'
          }}
        >
          Vidéos
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600',
            backgroundColor: activeTab === 'users' ? '#fff' : 'transparent',
            color: activeTab === 'users' ? '#000' : '#8E8E93',
            boxShadow: activeTab === 'users' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s ease', cursor: 'pointer'
          }}
        >
          Utilisateurs
        </button>
      </div>

      {/* CONTENU VARIABLE */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Loader2 className="animate-spin" color="var(--color-gold)" size={32} />
        </div>
      ) : (
        <>
          {/* ONGLET VIDÉOS */}
          {activeTab === 'videos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Button fullWidth onClick={() => navigate('/admin/upload')}>
                <Plus size={20} /> Nouveau cours
              </Button>
              
              {videos.length === 0 ? <p style={{textAlign:'center', color:'#888'}}>Aucune vidéo.</p> : videos.map((video) => (
                <div key={video._id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={iconBoxStyle}><Video size={24} color="#1D1D1F" /></div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{video.title}</h3>
                      <p style={{ fontSize: '12px', color: '#888' }}>{new Date(video.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteVideo(video._id)} style={deleteBtnStyle}>
                    <Trash2 size={18} color="#FF3B30" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ONGLET UTILISATEURS */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{fontSize:'18px'}}>Membres ({usersList.length})</h2>
              
              {usersList.map((usr) => (
                <div key={usr._id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    {/* Avatar Initiales */}
                    <div style={{ ...iconBoxStyle, backgroundColor: usr.role === 'admin' ? '#FFD700' : '#E5E5EA' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{usr.name.charAt(0).toUpperCase()}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                        {usr.name} {usr.role === 'admin' && <span style={{fontSize:'10px', background:'#000', color:'#FFF', padding:'2px 6px', borderRadius:'4px'}}>ADMIN</span>}
                      </h3>
                      
                      {/* Infos Contact */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                        <Mail size={12} /> {usr.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                        <Phone size={12} /> {usr.phone}
                      </div>
                    </div>
                  </div>

                  {/* Bouton Supprimer (On ne peut pas se supprimer soi-même) */}
                  {usr._id !== user._id && (
                    <button onClick={() => handleDeleteUser(usr._id)} style={deleteBtnStyle}>
                      <Trash2 size={18} color="#FF3B30" />
                    </button>
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

// Styles CSS-in-JS pour garder le code propre
const cardStyle = {
  backgroundColor: '#fff', padding: '16px', borderRadius: '20px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
};

const iconBoxStyle = {
  width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
  backgroundColor: '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const deleteBtnStyle = {
  background: '#FFE5E5', border: 'none', width: '36px', height: '36px',
  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', marginLeft: '8px'
};

export default AdminDashboard;