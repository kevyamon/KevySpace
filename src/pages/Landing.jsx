// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';
import packageJson from '../../package.json'; 

const Landing = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear(); 

  return (
    <div style={{
      /* Layout global */
      minHeight: '100%', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', 
      padding: '20px', 
      paddingTop: '30px', // RÉDUIT (avant: 50px)
      paddingBottom: '20px', // RÉDUIT (avant: 32px)
      overflowX: 'hidden', 
    }}>
      
      {/* 1. HEADER & TITRES */}
      <div style={{ 
        flex: '0 0 auto', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        
        {/* APP NAME CENTRÉ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 style={{ 
            fontSize: 'clamp(32px, 8vw, 42px)', // LÉGÈREMENT RÉDUIT
            lineHeight: '1.1', 
            marginBottom: '12px',
            fontWeight: '800',
            textAlign: 'center',
          }}>
            Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>.
          </h1>
        </motion.div>

        {/* SLOGAN */}
        <div style={{ marginBottom: '8px', textAlign: 'center' }}>
          <WavyText 
            text="La formation réinventée." 
            delay={0.3}
            style={{
              fontSize: '22px', // RÉDUIT (26px -> 22px)
              fontWeight: '700',
              color: 'var(--color-text-main)',
              lineHeight: '1.2',
            }}
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ 
              fontSize: '14px', 
              color: 'var(--color-text-secondary)', 
              fontWeight: '500',
              marginTop: '6px'
            }}
          >
            Sécurisée. Fluide. Privée.
          </motion.p>
        </div>

        {/* LISTE FEATURES (COMPACTÉE) */}
        <div style={{ 
          marginTop: '24px', // FORTEMENT RÉDUIT (48px -> 24px)
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', // RÉDUIT (24px -> 16px)
          width: '100%' 
        }}>
          <FeatureItem 
            icon={<Rocket size={18} color="#FFD700" />} 
            text="Apprentissage ultra-rapide" 
            delay={0.4} 
            direction="left"
          />
          <FeatureItem 
            icon={<ShieldCheck size={18} color="#FFD700" />} 
            text="Contenu 100% sécurisé" 
            delay={0.6} 
            direction="right"
          />
          <FeatureItem 
            icon={<Zap size={18} color="#FFD700" />} 
            text="Expérience fluide" 
            delay={0.8} 
            direction="left"
          />
        </div>
      </div>

      {/* 2. SPACER FLEXIBLE */}
      <div style={{ flex: '1 1 auto', minHeight: '20px' }}></div>

      {/* 3. BOUTONS CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 50 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px', // Espacement réduit entre boutons
          flex: '0 0 auto',
          width: '100%'
        }}
      >
        {/* BOUTONS EN TAILLE SMALL */}
        <Button fullWidth onClick={() => navigate('/login')} pulse={true} size="small">
          Se connecter
        </Button>
        <Button variant="secondary" fullWidth onClick={() => navigate('/register')} pulse={true} size="small">
          Créer un compte
        </Button>
        
        {/* FOOTER BIEN VISIBLE MAINTENANT */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '10px', 
          color: '#999', 
          marginTop: '10px',
          fontWeight: '500',
          lineHeight: '1.4' 
        }}>
          <p style={{ margin: 0 }}>Par Kevin Amon@{currentYear} Tout droit réservé</p>
          <p style={{ margin: 0 }}>v{packageJson.version} • Mobile Experience</p>
        </div>

      </motion.div>
    </div>
  );
};

/* --- COMPOSANTS INTERNES --- */

const WavyText = ({ text, style, delay = 0 }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay }, 
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    hidden: {
      opacity: 0,
      y: 20, 
      transition: { type: "spring", damping: 12, stiffness: 200 },
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
          {letter === " " ? "\u00A0" : letter} 
        </motion.span>
      ))}
    </motion.div>
  );
};

const FeatureItem = ({ icon, text, delay, direction }) => {
  const startX = direction === 'left' ? -50 : 50;

  return (
    <motion.div 
      initial={{ opacity: 0, x: startX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 80, damping: 15 }}
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <div style={{ 
        background: '#fff', 
        padding: '10px', // Padding réduit
        borderRadius: '10px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ 
        fontWeight: '600', 
        fontSize: '14px', // Police réduite
        color: 'var(--color-text-main)',
      }}>
        {text}
      </span>
    </motion.div>
  );
};

export default Landing;