// src/pages/Profile.jsx
import React, { useContext, useState } from 'react'; // <--- AJOUT useState
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Edit2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal'; // <--- IMPORT

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false); // <--- ÉTAT POUR LA MODALE

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Callback quand la modale a réussi
  const handleUpdateSuccess = (updatedUser) => {
    // Pour faire simple et robuste, on recharge la page pour rafraîchir le contexte
    // (Dans une version V2, on mettra à jour le contexte directement)
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px 24px 100px 24px', minHeight: '100%' }}>
      
      {/* EN-TÊTE */}
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#1D1D1F' }}>
        Mon Profil
      </h1>

      {/* CARTE D'IDENTITÉ */}
      <div style={{ 
        backgroundColor: '#FFF', borderRadius: '24px', padding: '32px 24px',
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ 
          width: '100px', height: '100px', borderRadius: '50%', 
          backgroundColor: 'var(--color-gold)', color: '#FFF',
          fontSize: '40px', fontWeight: '800', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px', boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1D1D1F', marginBottom: '4px' }}>
          {user.name}
        </h2>
        <span style={{ 
          fontSize: '12px', fontWeight: '600', 
          color: user.role === 'admin' ? '#FF3B30' : '#86868B',
          backgroundColor: user.role === 'admin' ? '#FFF0F0' : '#F5F5F7',
          padding: '4px 12px', borderRadius: '20px'
        }}>
          {user.role === 'admin' ? 'Administrateur' : 'Étudiant Certifié'}
        </span>
      </div>

      {/* INFORMATIONS DÉTAILLÉES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InfoItem icon={<User size={20} />} label="Nom complet" value={user.name} />
        <InfoItem icon={<Mail size={20} />} label="Email" value={user.email} />
        <InfoItem icon={<Phone size={20} />} label="Téléphone" value={user.phone} />
        <InfoItem icon={<Shield size={20} />} label="Statut du compte" value="Actif" color="#34C759" />
      </div>

      {/* BOUTONS D'ACTION */}
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* BOUTON MODIFIER - CONNECTÉ */}
        <button 
          onClick={() => setIsEditOpen(true)} // <--- CLIC
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

      {/* MODALE D'ÉDITION */}
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        user={user}
        onUpdate={handleUpdateSuccess}
      />

    </div>
  );
};

// Petit composant pour les lignes d'info
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