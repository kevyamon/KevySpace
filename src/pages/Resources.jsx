// src/pages/Resources.jsx
import React, { useEffect, useState } from 'react';
import { Download, FileText, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import io from 'socket.io-client';

const socket = io('https://kevyspace-backend.onrender.com');

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchResources();

    socket.on('resource_action', (payload) => {
      if (payload.type === 'add') {
        setResources(prev => [payload.data, ...prev]);
      } else if (payload.type === 'delete') {
        setResources(prev => prev.filter(r => r._id !== payload.id));
      }
    });

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

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" color="var(--color-gold)" size={40} />
    </div>
  );

  return (
    <div style={{ padding: '24px 16px 60px 16px', minHeight: '100%' }}>
      
      {/* EN-TÊTE */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-gold)', marginBottom: '8px' }}>Ressources</h1>
        <p style={{ fontSize: '14px', color: 'rgba(245, 243, 240, 0.6)' }}>Fichiers complémentaires ({resources.length})</p>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        backgroundColor: searchFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)', 
        padding: '12px 16px', 
        borderRadius: '16px', 
        boxShadow: searchFocused ? '0 4px 20px rgba(255, 215, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.15)', 
        marginBottom: '24px', 
        border: searchFocused ? '1px solid var(--color-gold)' : '1px solid rgba(255, 215, 0, 0.2)',
        transition: 'all 0.2s ease'
      }}>
        <Search size={20} color={searchFocused ? '#FFD700' : 'rgba(245, 243, 240, 0.4)'} style={{ transition: 'color 0.2s ease' }} />
        <input 
          type="text" 
          placeholder="Rechercher..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{ 
            border: 'none', 
            outline: 'none', 
            width: '100%', 
            fontSize: '14px', 
            color: 'var(--color-text-on-bg-secondary)',
            backgroundColor: 'transparent',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* LISTE DES RESSOURCES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {filtered.length === 0 ? (
            /* ÉTAT VIDE */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', marginTop: '40px', textAlign: 'center',
                padding: '40px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 215, 0, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid rgba(255, 215, 0, 0.2)'
              }}>
                <FileText size={36} color="rgba(255, 215, 0, 0.5)" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-text-on-bg-secondary)' }}>
                Aucune ressource
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(245, 243, 240, 0.6)', lineHeight: '1.5', maxWidth: '280px' }}>
                {searchTerm ? 'Aucun fichier ne correspond à votre recherche.' : 'Les ressources complémentaires apparaîtront ici.'}
              </p>
            </motion.div>
          ) : filtered.map((file) => (
            <motion.div
              key={file._id}
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                padding: '16px', 
                borderRadius: '18px', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
                border: '1px solid rgba(255, 215, 0, 0.1)', 
                overflow: 'hidden' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                  backgroundColor: 'rgba(255, 215, 0, 0.15)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255, 215, 0, 0.25)' 
                }}>
                  <FileText size={24} color="#FFD700" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ 
                    fontSize: '14px', fontWeight: '700', color: 'var(--color-text-on-bg-secondary)', 
                    marginBottom: '4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {file.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(245, 243, 240, 0.5)' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      backgroundColor: 'rgba(255, 215, 0, 0.15)', 
                      color: 'var(--color-gold)',
                      padding: '2px 6px', 
                      borderRadius: '6px' 
                    }}>
                      {file.type || 'FILE'}
                    </span>
                    <span>•</span>
                    <span>{file.size}</span>
                  </div>
                </div>
              </div>

              {/* BOUTON TÉLÉCHARGER */}
              <a 
                href={file.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  border: '1px solid rgba(255, 215, 0, 0.3)', 
                  backgroundColor: 'rgba(255, 215, 0, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: 'var(--color-gold)',
                  transition: 'all 0.2s ease',
                  marginLeft: '12px'
                }}
              >
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