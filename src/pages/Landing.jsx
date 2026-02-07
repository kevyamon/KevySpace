// src/pages/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, ShieldCheck, Zap, Play, Users, BookOpen, Award,
  Star, ArrowRight, X, UserPlus, LogIn, Globe, Lock, Sparkles,
  Monitor, Smartphone, CheckCircle
} from 'lucide-react';
import packageJson from '../../package.json';

const Landing = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{
      minHeight: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      backgroundColor: 'var(--color-bg)'
    }}>

      {/* ============================================
          1. HERO SECTION
          ============================================ */}
      <section style={{
        padding: 'clamp(40px, 8vh, 80px) 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* GRADIENT ORB DÉCORATIF */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-80px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            marginBottom: '24px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-gold)'
          }}
        >
          <Sparkles size={14} />
          Plateforme de formation nouvelle génération
        </motion.div>

        {/* TITRE PRINCIPAL */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: 'clamp(32px, 7vw, 56px)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '16px',
            color: 'var(--color-text-on-bg-secondary)',
            maxWidth: '700px'
          }}
        >
          Apprenez. <span style={{ color: 'var(--color-gold)' }}>Progressez.</span> Excellez.
        </motion.h1>

        {/* SOUS-TITRE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontSize: 'clamp(15px, 2.5vw, 18px)',
            color: 'rgba(245, 243, 240, 0.6)',
            maxWidth: '520px',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}
        >
          Accédez à des formations exclusives, suivez votre progression et obtenez vos certificats. 
          Le tout dans un espace sécurisé et fluide.
        </motion.p>

        {/* CTA PRINCIPAL */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 36px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-bg)',
            fontSize: '16px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(255, 215, 0, 0.35)',
            maxWidth: '320px'
          }}
        >
          Commencer l'aventure <ArrowRight size={20} />
        </motion.button>

        {/* INDICATEUR DE CONFIANCE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            fontSize: '12px',
            color: 'rgba(245, 243, 240, 0.4)'
          }}
        >
          <Lock size={12} />
          Inscription gratuite • Contenu sécurisé • Accès immédiat
        </motion.div>
      </section>

      {/* ============================================
          2. SECTION STATS
          ============================================ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          padding: '0 20px 40px 20px',
          maxWidth: '700px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <StatCard icon={<BookOpen size={20} />} number="50+" label="Cours disponibles" />
        <StatCard icon={<Users size={20} />} number="200+" label="Étudiants actifs" />
        <StatCard icon={<Award size={20} />} number="100+" label="Certificats délivrés" />
      </motion.section>

      {/* ============================================
          3. SECTION FEATURES
          ============================================ */}
      <section style={{
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <h2 style={{
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: '800',
            color: 'var(--color-text-on-bg-secondary)',
            marginBottom: '8px'
          }}>
            Pourquoi <span style={{ color: 'var(--color-gold)' }}>KevySpace</span> ?
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'rgba(245, 243, 240, 0.5)',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            Une expérience d'apprentissage pensée pour vous.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <FeatureCard
            icon={<Rocket size={22} />}
            title="Apprentissage rapide"
            description="Des modules courts et efficaces pour apprendre à votre rythme, où que vous soyez."
            delay={0.1}
          />
          <FeatureCard
            icon={<ShieldCheck size={22} />}
            title="Contenu sécurisé"
            description="Vos données et vos cours sont protégés. Streaming sécurisé anti-piratage."
            delay={0.2}
          />
          <FeatureCard
            icon={<Zap size={22} />}
            title="Interface fluide"
            description="Une application rapide et intuitive, optimisée mobile et desktop."
            delay={0.3}
          />
          <FeatureCard
            icon={<Award size={22} />}
            title="Certificats officiels"
            description="Validez vos compétences et obtenez un certificat à la fin de chaque formation."
            delay={0.4}
          />
          <FeatureCard
            icon={<Globe size={22} />}
            title="Accessible partout"
            description="Apprenez depuis votre téléphone, tablette ou ordinateur. Toujours synchronisé."
            delay={0.5}
          />
          <FeatureCard
            icon={<Monitor size={22} />}
            title="Suivi de progression"
            description="Historique de visionnage, favoris et statistiques pour mesurer vos progrès."
            delay={0.6}
          />
        </div>
      </section>

      {/* ============================================
          4. SECTION TÉMOIGNAGES
          ============================================ */}
      <section style={{
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '24px' }}
        >
          <h2 style={{
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: '800',
            color: 'var(--color-text-on-bg-secondary)',
            marginBottom: '8px'
          }}>
            Ils nous font <span style={{ color: 'var(--color-gold)' }}>confiance</span>
          </h2>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}>
          <TestimonialCard
            name="Amadou K."
            role="Développeur Web"
            text="KevySpace m'a permis de monter en compétences très rapidement. Les cours sont clairs et bien structurés."
            rating={5}
            delay={0.1}
          />
          <TestimonialCard
            name="Marie D."
            role="Étudiante en design"
            text="L'interface est magnifique et l'expérience mobile est parfaite. Je recommande à 100% !"
            rating={5}
            delay={0.2}
          />
          <TestimonialCard
            name="Ibrahim S."
            role="Entrepreneur"
            text="Les certificats m'ont aidé à prouver mes compétences auprès de mes clients. Un investissement qui vaut le coup."
            rating={5}
            delay={0.3}
          />
        </div>
      </section>

      {/* ============================================
          5. CTA FINAL
          ============================================ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{
          padding: '32px 24px',
          borderRadius: '24px',
          backgroundColor: 'rgba(255, 215, 0, 0.08)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
          <h3 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: 'var(--color-text-on-bg-secondary)',
            marginBottom: '8px'
          }}>
            Prêt à commencer ?
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'rgba(245, 243, 240, 0.5)',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Rejoignez la communauté KevySpace et transformez votre parcours d'apprentissage.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              borderRadius: '14px',
              backgroundColor: 'var(--color-gold)',
              color: 'var(--color-bg)',
              fontSize: '15px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)'
            }}
          >
            <Play size={18} />
            Commencer l'aventure
          </motion.button>
        </div>
      </motion.section>

      {/* ============================================
          6. FOOTER
          ============================================ */}
      <footer style={{
        padding: '24px 20px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 215, 0, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: '800',
            color: 'var(--color-text-on-bg-secondary)'
          }}>
            Kevy<span style={{ color: 'var(--color-gold)' }}>Space</span>
          </span>
        </div>
        <p style={{
          fontSize: '11px',
          color: 'rgba(245, 243, 240, 0.3)',
          lineHeight: '1.5'
        }}>
          © {currentYear} KevySpace v{packageJson.version} — Par Kevin Amon. Tous droits réservés.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '8px',
          fontSize: '11px'
        }}>
          <span style={{ color: 'rgba(245, 243, 240, 0.25)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Smartphone size={10} /> Mobile
          </span>
          <span style={{ color: 'rgba(245, 243, 240, 0.25)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Monitor size={10} /> Desktop
          </span>
          <span style={{ color: 'rgba(245, 243, 240, 0.25)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={10} /> Sécurisé
          </span>
        </div>
      </footer>

      {/* ============================================
          7. MODALE "COMMENCER L'AVENTURE"
          ============================================ */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(12px)'
              }}
            />

            {/* CONTENU MODALE */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: '28px',
                padding: '32px 24px',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                textAlign: 'center'
              }}
            >
              {/* BOUTON FERMER */}
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} color="rgba(245, 243, 240, 0.6)" />
              </motion.button>

              {/* ICÔNE CENTRALE */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Sparkles size={28} color="var(--color-gold)" />
              </div>

              <h2 style={{
                fontSize: '22px',
                fontWeight: '800',
                color: 'var(--color-text-on-bg-secondary)',
                marginBottom: '8px'
              }}>
                Bienvenue sur <span style={{ color: 'var(--color-gold)' }}>KevySpace</span>
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 243, 240, 0.5)',
                marginBottom: '28px',
                lineHeight: '1.5'
              }}>
                Comment souhaitez-vous continuer ?
              </p>

              {/* BOUTONS */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* NOUVEAU */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsModalOpen(false); navigate('/register'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-gold)',
                    color: 'var(--color-bg)',
                    fontSize: '15px',
                    fontWeight: '800',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <UserPlus size={18} />
                  Je suis nouveau
                </motion.button>

                {/* DÉJÀ INSCRIT */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsModalOpen(false); navigate('/login'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--color-text-on-bg-secondary)',
                    fontSize: '15px',
                    fontWeight: '700',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    cursor: 'pointer'
                  }}
                >
                  <LogIn size={18} color="var(--color-gold)" />
                  Déjà inscrit
                </motion.button>
              </div>

              {/* MENTION */}
              <p style={{
                fontSize: '11px',
                color: 'rgba(245, 243, 240, 0.3)',
                marginTop: '20px'
              }}>
                <Lock size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Vos données sont protégées et chiffrées
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

/* ============================================
   COMPOSANTS INTERNES
   ============================================ */

const StatCard = ({ icon, number, label }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    style={{
      padding: '20px 16px',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 215, 0, 0.1)',
      textAlign: 'center',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
    }}
  >
    <div style={{
      color: 'var(--color-gold)',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div style={{
      fontSize: '24px',
      fontWeight: '900',
      color: 'var(--color-gold)',
      marginBottom: '4px'
    }}>
      {number}
    </div>
    <div style={{
      fontSize: '12px',
      color: 'rgba(245, 243, 240, 0.5)',
      fontWeight: '500'
    }}>
      {label}
    </div>
  </motion.div>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    style={{
      padding: '24px 20px',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 215, 0, 0.1)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      transition: 'border-color 0.2s'
    }}
  >
    <div style={{
      width: '44px', height: '44px', borderRadius: '14px',
      backgroundColor: 'rgba(255, 215, 0, 0.12)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '14px',
      color: 'var(--color-gold)'
    }}>
      {icon}
    </div>
    <h3 style={{
      fontSize: '15px',
      fontWeight: '700',
      color: 'var(--color-text-on-bg-secondary)',
      marginBottom: '6px'
    }}>
      {title}
    </h3>
    <p style={{
      fontSize: '13px',
      color: 'rgba(245, 243, 240, 0.5)',
      lineHeight: '1.5'
    }}>
      {description}
    </p>
  </motion.div>
);

const TestimonialCard = ({ name, role, text, rating, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    style={{
      padding: '24px 20px',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 215, 0, 0.08)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    }}
  >
    {/* ÉTOILES */}
    <div style={{
      display: 'flex',
      gap: '2px',
      marginBottom: '12px'
    }}>
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} size={14} color="#FFD700" fill="#FFD700" />
      ))}
    </div>

    {/* TEXTE */}
    <p style={{
      fontSize: '13px',
      color: 'var(--color-text-on-bg-secondary)',
      lineHeight: '1.5',
      marginBottom: '16px',
      fontStyle: 'italic'
    }}>
      "{text}"
    </p>

    {/* AUTEUR */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        border: '1px solid rgba(255, 215, 0, 0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '800',
        color: 'var(--color-gold)',
        fontSize: '14px'
      }}>
        {name.charAt(0)}
      </div>
      <div>
        <div style={{
          fontSize: '13px',
          fontWeight: '700',
          color: 'var(--color-text-on-bg-secondary)'
        }}>
          {name}
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(245, 243, 240, 0.4)'
        }}>
          {role}
        </div>
      </div>
    </div>
  </motion.div>
);

export default Landing;