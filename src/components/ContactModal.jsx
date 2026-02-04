// src/components/ContactModal.jsx
import React from 'react';
import ReactDOM from 'react-dom'; // Nécessaire pour le Portal
import { motion, AnimatePresence } from 'framer-motion';
import { X, Facebook, Instagram, MessageCircle } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  const socialLinks = {
    whatsapp: import.meta.env.VITE_WHATSAPP_LINK || "https://wa.me/",
    facebook: import.meta.env.VITE_FACEBOOK_LINK || "https://facebook.com",
    instagram: import.meta.env.VITE_INSTAGRAM_LINK || "https://instagram.com"
  };

  // Le contenu de la modale
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 10000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'auto' // S'assure qu'on peut cliquer
        }}>
          
          {/* FOND SOMBRE FLOU */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(5px)',
            }}
          />

          {/* LA CARTE MODALE (Centrée parfaitement) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'relative', // Relatif à son flex container centré
              width: '90%', maxWidth: '340px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.5)'
            }}
          >
            {/* Header Modale */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Contact</h3>
              
              {/* CROIX ROUGE */}
              <button 
                onClick={onClose} 
                style={{ 
                  background: '#FFE5E5', // Fond rouge très pâle
                  border: 'none', 
                  borderRadius: '50%', 
                  padding: '8px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} color="#FF3B30" />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', textAlign: 'center' }}>
              Une question sur la formation ? <br/> Je suis disponible ici :
            </p>

            {/* GRILLE DES RÉSEAUX */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SocialButton label="WhatsApp" icon={<MessageCircle size={20} color="#FFF" />} color="#25D366" link={socialLinks.whatsapp} />
              <SocialButton label="Facebook" icon={<Facebook size={20} color="#FFF" />} color="#1877F2" link={socialLinks.facebook} />
              <SocialButton label="Instagram" icon={<Instagram size={20} color="#FFF" />} color="#E1306C" link={socialLinks.instagram} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // ON UTILISE UN PORTAL POUR SORTIR DU SIDEBAR ET ÊTRE AU DESSUS DE TOUT
  return ReactDOM.createPortal(modalContent, document.body);
};

const SocialButton = ({ label, icon, color, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '12px 16px', borderRadius: '16px',
      backgroundColor: '#FFF',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.05)',
      transition: 'transform 0.1s'
    }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <span style={{ fontSize: '15px', fontWeight: '600', color: '#1D1D1F' }}>{label}</span>
    </div>
  </a>
);

export default ContactModal;