// src/pages/Resources.jsx
import React from 'react';
import { Download, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Resources = () => {
  // DONNÉES SIMULÉES
  // Quand on aura le backend, on pourra ajouter un champ 'resources' aux vidéos
  const resources = [
    { id: 1, title: "Guide complet du débutant React", type: "PDF", size: "2.4 MB", date: "Il y a 2 jours" },
    { id: 2, title: "Cheatsheet JavaScript ES6+", type: "PDF", size: "1.1 MB", date: "Il y a 1 semaine" },
    { id: 3, title: "Architecture MERN - Schéma", type: "PNG", size: "450 KB", date: "Il y a 3 semaines" },
  ];

  return (
    <div style={{ padding: '24px 24px 100px 24px', minHeight: '100%' }}>
      
      {/* EN-TÊTE */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F', marginBottom: '8px' }}>Ressources</h1>
        <p style={{ fontSize: '14px', color: '#86868B' }}>Fichiers complémentaires à vos cours.</p>
      </div>

      {/* BARRE DE RECHERCHE (Visuelle) */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px',
        backgroundColor: '#FFF', padding: '12px 16px', borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '24px', border: '1px solid #F2F2F7'
      }}>
        <Search size={20} color="#CCC" />
        <input 
          type="text" placeholder="Rechercher un fichier..." 
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#1D1D1F' }}
        />
      </div>

      {/* LISTE DES FICHIERS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {resources.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: '#FFF', padding: '16px', borderRadius: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #F9F9F9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Icône Fichier */}
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '14px', 
                backgroundColor: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileText size={24} color="#1D1D1F" />
              </div>
              
              {/* Infos Fichier */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1D1D1F', marginBottom: '4px' }}>
                  {file.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#86868B' }}>
                  <span style={{ fontWeight: '600', backgroundColor: '#EFEFEF', padding: '2px 6px', borderRadius: '6px' }}>{file.type}</span>
                  <span>•</span>
                  <span>{file.size}</span>
                </div>
              </div>
            </div>

            {/* Bouton Download */}
            <button style={{ 
              width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E5E5EA',
              backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#1D1D1F'
            }}>
              <Download size={20} />
            </button>
          </motion.div>
        ))}
        
        {/* FOOTER LISTE */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#CCC', marginTop: '20px' }}>
          Fin de la liste
        </p>
      </div>

    </div>
  );
};

export default Resources;