// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', // CRITICAL: 100vh au lieu de 100%
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px', // Réduit à 20px pour plus d'espace
      paddingTop: '40px', // Plus d'espace en haut
      paddingBottom: '32px', // Sécurité pour les boutons du bas
      overflowX: 'hidden', // Empêche débordement horizontal
    }}>
      
      {/* 1. HEADER & FEATURES */}
      <div style={{ flex: '0 0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ 
            fontSize: 'clamp(32px, 8vw, 42px)', // Responsive fluide
            lineHeight: '1.1', 
            marginBottom: '12px',
            fontWeight: '700',
          }}>
            Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>.
          </h1>
          <p style={{ 
            fontSize: '15px', 
            color: 'var(--color-text-secondary)', 
            fontWeight: '500',
            lineHeight: '1.5',
          }}>
            La formation réinventée. <br /> 
            Sécurisée. Fluide. Privée.
          </p>
        </motion.div>

        {/* Liste des features */}
        <div style={{ 
          marginTop: '36px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px' 
        }}>
          <FeatureItem 
            icon={<Rocket size={20} color="#FFD700" />} 
            text="Apprentissage ultra-rapide" 
            delay={0.2} 
          />
          <FeatureItem 
            icon={<ShieldCheck size={20} color="#FFD700" />} 
            text="Contenu 100% sécurisé" 
            delay={0.3} 
          />
          <FeatureItem 
            icon={<Zap size={20} color="#FFD700" />} 
            text="Expérience fluide" 
            delay={0.4} 
          />
        </div>
      </div>

      {/* 2. SPACER FLEXIBLE */}
      <div style={{ flex: '1 1 auto', minHeight: '32px' }}></div>

      {/* 3. BOUTONS CTA (STICKY BOTTOM) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          flex: '0 0 auto',
        }}
      >
        <Button fullWidth onClick={() => navigate('/login')}>
          Se connecter
        </Button>
        <Button variant="secondary" fullWidth onClick={() => navigate('/register')}>
          Créer un compte
        </Button>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '11px', 
          color: '#999', 
          marginTop: '12px',
          fontWeight: '500',
        }}>
          v1.0.0 • Mobile Experience
        </p>
      </motion.div>
    </div>
  );
};

const FeatureItem = ({ icon, text, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '14px' 
    }}
  >
    <div style={{ 
      background: '#fff', 
      padding: '10px', 
      borderRadius: '12px', 
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {icon}
    </div>
    <span style={{ 
      fontWeight: '600', 
      fontSize: '14px',
      color: 'var(--color-text-main)',
    }}>
      {text}
    </span>
  </motion.div>
);

export default Landing;