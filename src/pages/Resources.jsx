// src/pages/Resources.jsx
import React, { useEffect, useState } from 'react';
import { Download, FileText, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import io from 'socket.io-client'; // Import Socket

// On se connecte au socket (l'URL dépend de ton env, ici localhost ou prod)
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResources();

    // --- ÉCOUTE TEMPS RÉEL ---
    socket.on('resource_action', (payload) => {
      if (payload.type === 'add') {
        // On ajoute la nouvelle ressource en haut de la liste
        setResources(prev => [payload.data, ...prev]);
      } else if (payload.type === 'delete') {
        // On retire la ressource supprimée
        setResources(prev => prev.filter(r => r._id !== payload.id));
      }
    });

    // Nettoyage quand on quitte la page
    return () => {
      socket.off('resource_action');
    };
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/api/resources');
      setResources(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const filtered = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{height:'80vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Loader2 className="animate-spin" /></div>;

  return (
    <div style={{ padding: '24px 24px 100px 24px', minHeight: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F', marginBottom: '8px' }}>Ressources</h1>
        <p style={{ fontSize: '14px', color: '#86868B' }}>Fichiers complémentaires ({resources.length})</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFF', padding: '12px 16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '24px', border: '1px solid #F2F2F7' }}>
        <Search size={20} color="#CCC" />
        <input 
          type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#1D1D1F' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {filtered.length === 0 ? <p style={{textAlign:'center', color:'#999'}}>Aucune ressource.</p> : filtered.map((file) => (
            <motion.div
              key={file._id}
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: '16px', borderRadius: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F9F9F9', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={24} color="#1D1D1F" />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1D1D1F', marginBottom: '4px' }}>{file.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#86868B' }}>
                    <span style={{ fontWeight: '600', backgroundColor: '#EFEFEF', padding: '2px 6px', borderRadius: '6px' }}>{file.type || 'FILE'}</span>
                    <span>•</span>
                    <span>{file.size}</span>
                  </div>
                </div>
              </div>
              <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E5E5EA', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D1D1F' }}>
                <Download size={20} />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Resources;