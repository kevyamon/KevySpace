// frontend/src/pages/admin/AdminResources.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Download, Trash2, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ResourceModal from '../../components/admin/ResourceModal';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

const AdminResources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await api.get('/api/resources');
      setResources(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchResources(); }, []);

  const requestDelete = (id) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!targetId) return;
    
    setDeletingId(targetId); 
    
    try {
      await api.delete(`/api/resources/${targetId}`);
      toast.success("Ressource supprimée !");
      setResources(prev => prev.filter(r => r._id !== targetId));
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
      setTargetId(null);
      setConfirmOpen(false); 
    }
  };

  return (
    <div style={{ padding: '24px 16px 60px 16px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft color="var(--color-gold)" />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-gold)' }}>Gérer Ressources</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'var(--color-gold)', color: 'var(--color-bg)', 
            border: 'none', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' 
          }}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* LISTE DES RESSOURCES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {resources.length === 0 ? (
          <div style={{ 
            textAlign: 'center', padding: '40px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 215, 0, 0.1)'
          }}>
            <p style={{ color: 'rgba(245, 243, 240, 0.5)', fontSize: '13px' }}>
              Aucune ressource ajoutée.
            </p>
          </div>
        ) : resources.map(r => (
          <div key={r._id} style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            padding: '16px', 
            background: 'rgba(255, 255, 255, 0.08)', 
            borderRadius: '16px', 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 215, 0, 0.1)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: 'rgba(255, 215, 0, 0.15)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255, 215, 0, 0.25)' 
              }}>
                <FileText color="#FFD700" size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '700', fontSize: '14px', color: 'var(--color-text-on-bg-secondary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' 
                }}>
                  {r.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(245, 243, 240, 0.5)' }}>{r.size}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
              <a 
                href={r.fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  width: '36px', height: '36px', borderRadius: '8px', 
                  background: 'rgba(255, 215, 0, 0.1)', 
                  color: 'var(--color-gold)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255, 215, 0, 0.2)' 
                }}
              >
                <Download size={18}/>
              </a>
              <button 
                onClick={() => requestDelete(r._id)} 
                disabled={deletingId === r._id} 
                style={{ 
                  width: '36px', height: '36px', borderRadius: '8px', 
                  background: 'rgba(255, 59, 48, 0.15)', 
                  color: '#FF3B30', 
                  border: '1px solid rgba(255, 59, 48, 0.25)', 
                  cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}
              >
                {deletingId === r._id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={18}/>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ResourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchResources} />
      
      <ConfirmModal 
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeDelete}
        title="Supprimer la ressource ?"
        message="Le fichier sera supprimé définitivement."
        isDangerous={true}
      />
    </div>
  );
};

export default AdminResources;