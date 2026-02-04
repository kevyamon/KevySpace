// src/pages/admin/AdminUpload.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, UploadCloud, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/Button';
import Input from '../../components/Input';
import axios from 'axios';

const AdminUpload = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Vérification sécu si besoin

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("Veuillez choisir une vidéo");

    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', file);

    try {
      await axios.post('https://kevyspace-backend.onrender.com/api/videos', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      // Retour au dashboard Admin après succès
      navigate('/admin/dashboard'); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de l'upload");
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

      {error && (
        <div style={{ padding: '12px', background: '#FFE5E5', color: '#D00', borderRadius: '12px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {!loading ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input placeholder="Titre de la leçon" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
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

          <input type="file" id="video-upload" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <label htmlFor="video-upload" style={{
              border: '2px dashed #E5E5EA', borderRadius: '20px', padding: '32px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              cursor: 'pointer', backgroundColor: file ? '#F2F2F7' : 'transparent',
              transition: 'all 0.2s ease'
            }}>
            {file ? (
              <>
                <FileVideo size={40} color="var(--color-gold)" />
                <span style={{ fontWeight: '600' }}>{file.name}</span>
              </>
            ) : (
              <>
                <UploadCloud size={40} color="#8E8E93" />
                <span style={{ color: '#8E8E93' }}>Choisir une vidéo</span>
              </>
            )}
          </label>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <Button type="submit" fullWidth>Publier la leçon</Button>
          </div>
        </form>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <UploadCloud size={64} color="var(--color-gold)" />
          </motion.div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Envoi en cours...</h3>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E5EA', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} style={{ height: '100%', backgroundColor: 'var(--color-gold)' }} />
            </div>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>{uploadProgress}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpload;