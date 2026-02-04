import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ResourceModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Tous les champs sont requis");

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      await api.post('/api/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Ressource ajoutée !");
      onSuccess();
      onClose();
      // Reset
      setTitle('');
      setFile(null);
    } catch (err) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(4px)' }} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'fixed', top: '50%', left: '50%', translate: '-50% -50%', width: '90%', maxWidth: '400px', background: '#FFF', padding: '24px', borderRadius: '20px', zIndex: 9999, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Ajouter une Ressource</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Titre du fichier (ex: Guide React)" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E5E5EA', outline: 'none' }} />
              
              <div onClick={() => document.getElementById('resFile').click()} style={{ border: '2px dashed #E5E5EA', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: file ? '#F0FFF4' : 'transparent', borderColor: file ? '#34C759' : '#E5E5EA' }}>
                <input id="resFile" type="file" accept=".pdf,.png,.jpg,.jpeg,.zip" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                {file ? <div style={{color:'#34C759', fontWeight:'bold'}}>{file.name}</div> : <div style={{color:'#888', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}><Upload size={18}/> Choisir un fichier</div>}
              </div>

              <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '12px', background: '#1D1D1F', color: '#FFF', border: 'none', fontWeight: '700', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {loading ? <Loader2 className="animate-spin"/> : "Publier la ressource"}
              </button>
            </form>

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ResourceModal;