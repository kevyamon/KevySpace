// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';
import packageJson from '../../package.json'; // <--- 1. IMPORT DE LA VERSION

const Landing = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear(); // <--- 2. ANNÉE AUTOMATIQUE

  return (
    <div style={{
      /* Layout global */
      minHeight: '100%', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // CENTRAGE HORIZONTAL DES ENFANTS
      padding: '20px', 
      paddingTop: '50px', 
      paddingBottom: '32px', 
      overflowX: 'hidden', 
    }}>
      
      {/* 1. HEADER & TITRES */}
      <div style={{ 
        flex: '0 0 auto', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' // Centrage spécifique du header
      }}>
        
        {/* APP NAME CENTRÉ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 style={{ 
            fontSize: 'clamp(36px, 10vw, 48px)', 
            lineHeight: '1.1', 
            marginBottom: '16px',
            fontWeight: '800',
            textAlign: 'center',
          }}>
            Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>.
          </h1>
        </motion.div>

        {/* SLOGAN "VAGUE" (GROS TITRE) */}
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <WavyText 
            text="La formation réinventée." 
            delay={0.3}
            style={{
              fontSize: '26px', // Gros titre
              fontWeight: '700',
              color: 'var(--color-text-main)',
              lineHeight: '1.2',
            }}
          />
          
          {/* Sous-titre plus discret */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ 
              fontSize: '15px', 
              color: 'var(--color-text-secondary)', 
              fontWeight: '500',
              marginTop: '8px'
            }}
          >
            Sécurisée. Fluide. Privée.
          </motion.p>
        </div>

        {/* LISTE FEATURES (ZIG-ZAG) */}
        <div style={{ 
          marginTop: '48px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          width: '100%' 
        }}>
          <FeatureItem 
            icon={<Rocket size={20} color="#FFD700" />} 
            text="Apprentissage ultra-rapide" 
            delay={0.4} 
            direction="left"
          />
          <FeatureItem 
            icon={<ShieldCheck size={20} color="#FFD700" />} 
            text="Contenu 100% sécurisé" 
            delay={0.6} 
            direction="right"
          />
          <FeatureItem 
            icon={<Zap size={20} color="#FFD700" />} 
            text="Expérience fluide" 
            delay={0.8} 
            direction="left"
          />
        </div>
      </div>

      {/* 2. SPACER FLEXIBLE */}
      <div style={{ flex: '1 1 auto', minHeight: '32px' }}></div>

      {/* 3. BOUTONS CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 50 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          flex: '0 0 auto',
          width: '100%'
        }}
      >
        <Button fullWidth onClick={() => navigate('/login')} pulse={true}>
          Se connecter
        </Button>
        <Button variant="secondary" fullWidth onClick={() => navigate('/register')} pulse={true}>
          Créer un compte
        </Button>
        
        {/* FOOTER : VERSION DYNAMIQUE + COPYRIGHT */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '11px', 
          color: '#999', 
          marginTop: '12px',
          fontWeight: '500',
          lineHeight: '1.5' // Un peu d'air entre les lignes
        }}>
          <p style={{ margin: 0 }}>Par Kevin Amon@{currentYear} Tout droit réservé</p>
          <p style={{ margin: 0 }}>v{packageJson.version} • Mobile Experience</p>
        </div>

      </motion.div>
    </div>
  );
};

/* --- COMPOSANTS INTERNES --- */

// Composant pour l'effet Vague (Lettre par lettre)
const WavyText = ({ text, style, delay = 0 }) => {
  // On décompose le texte en lettres
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }, // Effet cascade rapide
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20, // Les lettres viennent du bas
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "inline-block", ...style }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index} style={{ display: 'inline-block' }}>
          {letter === " " ? "\u00A0" : letter} {/* Gestion des espaces insécables */}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Composant FeatureItem avec direction
const FeatureItem = ({ icon, text, delay, direction }) => {
  const startX = direction === 'left' ? -50 : 50;

  return (
    <motion.div 
      initial={{ opacity: 0, x: startX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay, 
        type: "spring", 
        stiffness: 80,
        damping: 15
      }}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '14px' 
      }}
    >
      <div style={{ 
        background: '#fff', 
        padding: '12px',
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', // Ombre légèrement renforcée
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ 
        fontWeight: '600', 
        fontSize: '15px', // Un poil plus lisible
        color: 'var(--color-text-main)',
      }}>
        {text}
      </span>
    </motion.div>
  );
};

export default Landing;