// src/pages/Certificates.jsx
import React from 'react';
import { Award, Lock, Download, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Certificates = () => {
  // DONNÉES SIMULÉES (À remplacer par l'API plus tard)
  // Pour tester l'affichage vide, mets cette liste à []
  const certificates = [
    // { id: 1, title: "Maîtrise Complète de React", date: "12 Jan 2026", image: "https://via.placeholder.com/300x200" } 
  ];

  return (
    <div style={{ padding: '24px 24px 100px 24px', minHeight: '100%' }}>
      
      {/* EN-TÊTE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ 
          width: '44px', height: '44px', borderRadius: '14px', 
          backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.1)'
        }}>
          <Award size={24} color="#FFD700" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1D1D1F', lineHeight: '1.2' }}>Mes Certificats</h1>
          <p style={{ fontSize: '13px', color: '#86868B' }}>Vos trophées de compétences</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        // --- ÉTAT VIDE (MOTIVATION) ---
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', marginTop: '60px', textAlign: 'center',
            padding: '40px 20px', backgroundColor: '#FFF', borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', marginBottom: '24px',
            background: 'linear-gradient(135deg, #F5F5F7 0%, #FFF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E5E5EA'
          }}>
            <Lock size={40} color="#C7C7CC" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: '#1D1D1F' }}>
            Aucun certificat... pour l'instant !
          </h3>
          <p style={{ fontSize: '14px', color: '#86868B', lineHeight: '1.6', maxWidth: '300px' }}>
            Complétez tous les modules d'un cours pour débloquer votre certificat officiel de réussite.
          </p>
          <button style={{ 
            marginTop: '24px', padding: '12px 24px', borderRadius: '16px',
            backgroundColor: 'var(--color-gold)', color: '#FFF', fontWeight: '700', border: 'none',
            fontSize: '14px', cursor: 'pointer'
          }}>
            Reprendre les cours
          </button>
        </motion.div>
      ) : (
        // --- LISTE DES CERTIFICATS ---
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {certificates.map((cert) => (
            <motion.div 
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ 
                backgroundColor: '#FFF', borderRadius: '20px', overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.02)'
              }}
            >
              {/* Image/Aperçu du certificat */}
              <div style={{ height: '160px', backgroundColor: '#F5F5F7', position: 'relative' }}>
                <img src={cert.image} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
              </div>
              
              {/* Infos */}
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', color: '#1D1D1F' }}>{cert.title}</h3>
                <p style={{ fontSize: '12px', color: '#86868B', marginBottom: '16px' }}>Obtenu le {cert.date}</p>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px', borderRadius: '12px', backgroundColor: '#F5F5F7', 
                    color: '#1D1D1F', fontSize: '13px', fontWeight: '600', border: 'none'
                  }}>
                    <Download size={16} /> PDF
                  </button>
                  <button style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px', borderRadius: '12px', backgroundColor: '#1D1D1F', 
                    color: '#FFF', fontSize: '13px', fontWeight: '600', border: 'none'
                  }}>
                    <ExternalLink size={16} /> LinkedIn
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;