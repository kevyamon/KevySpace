// src/pages/admin/AdminResources.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Download, Trash2, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ResourceModal from '../../components/admin/ResourceModal';
import toast from 'react-hot-toast';

const AdminResources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Pour le loading spinner sur le bouton suppr

  const fetchResources = async () => {
    try {
      const res = await api.get('/api/resources');
      setResources(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Supprimer définitivement ce fichier ?")) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/api/resources/${id}`);
      toast.success("Fichier supprimé");
      // Mise à jour locale immédiate (optimiste)
      setResources(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      toast.error("Erreur suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft /></button>
          <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Gérer Ressources</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#1D1D1F', color:'#FFF', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Plus size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {resources.map(r => (
          <div key={r._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FFF', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText color="#1D1D1F" size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{r.title}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{r.size} • {new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{ width:'36px', height:'36px', borderRadius:'8px', background:'#F5F5F7', color:'#1D1D1F', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Download size={18}/>
              </a>
              <button 
                onClick={() => handleDelete(r._id)} 
                disabled={deletingId === r._id}
                style={{ width:'36px', height:'36px', borderRadius:'8px', background:'#FFF0F0', color:'#FF3B30', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}
              >
                {deletingId === r._id ? <Loader2 className="animate-spin" size={16}/> : <Trash2 size={18}/>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ResourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchResources} />
    </div>
  );
};

export default AdminResources;