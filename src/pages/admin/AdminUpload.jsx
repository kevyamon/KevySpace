// src/pages/admin/AdminUpload.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, UploadCloud, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import Input from '../../components/Input';
import toast from 'react-hot-toast'; // On utilise les jolis toasts
import api from '../../services/api'; // <--- LA CLÉ EST ICI (Notre service intelligent)

const AdminUpload = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirection si pas Admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Veuillez choisir une vidéo");

    setLoading(true);
    const loadingToast = toast.loading("Upload en cours... Ne quittez pas.");
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    try {
      // ON UTILISE 'api' AU LIEU DE 'axios'
      // Plus besoin de mettre l'URL complète, ni les headers d'auth manuelles
      await api.post('/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Seul header nécessaire ici pour les fichiers
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      toast.dismiss(loadingToast);
      toast.success("Cours publié avec succès ! 🚀");
      navigate('/admin/dashboard');

    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.error || "Erreur lors de l'upload";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft color="#1D1D1F" />
        </button>
        <h1 style={{ fontSize: '24px' }}>Nouveau Cours</h1>
      </div>

      {!loading ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <Input 
            placeholder="Titre de la leçon" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          
          <textarea
            placeholder="Description du cours..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
              backgroundColor: '#FFFFFF', fontSize: '16px', color: 'var(--color-text-main)',
              outline: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', fontFamily: 'inherit',
              minHeight: '120px', resize: 'none'
            }}
          />

          <input 
            type="file" 
            id="video-upload" 
            accept="video/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          
          <label 
            htmlFor="video-upload" 
            style={{
              border: '2px dashed #E5E5EA', borderRadius: '20px', padding: '32px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              cursor: 'pointer', backgroundColor: file ? '#F2F2F7' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {file ? (
              <>
                <FileVideo size={40} color="var(--color-gold)" />
                <span style={{ fontWeight: '600' }}>{file.name}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>Cliquez pour changer</span>
              </>
            ) : (
              <>
                <UploadCloud size={40} color="#8E8E93" />
                <span style={{ color: '#8E8E93' }}>Touchez pour choisir une vidéo</span>
              </>
            )}
          </label>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <Button type="submit" fullWidth>Publier la leçon</Button>
          </div>

        </form>
      ) : (
        // UI DE CHARGEMENT
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <UploadCloud size={64} color="var(--color-gold)" />
          </motion.div>
          
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Envoi vers le Cloud...</h3>
            <p style={{ color: '#888', marginBottom: '24px' }}>Ne quittez pas cette page.</p>
            
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E5EA', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                style={{ height: '100%', backgroundColor: 'var(--color-gold)' }}
              />
            </div>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{uploadProgress}%</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUpload;