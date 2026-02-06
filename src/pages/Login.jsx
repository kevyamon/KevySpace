// frontend/src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logoImg from '../assets/logo.png';
import packageJson from '../../package.json';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Bon retour parmi nous !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: field === 'password' ? '16px 52px 16px 52px' : '16px 16px 16px 52px',
    borderRadius: '16px',
    border: focusedField === field ? '1px solid var(--color-gold)' : '1px solid rgba(255, 215, 0, 0.2)',
    backgroundColor: focusedField === field ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
    fontSize: '16px',
    color: 'var(--color-text-on-bg-secondary)',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: focusedField === field ? '0 4px 20px rgba(255, 215, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.15)',
    fontFamily: 'inherit'
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'var(--color-bg)' 
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          {/* LOGO + TITRES */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', marginBottom: '16px', 
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
            }}>
              <img src={logoImg} alt="KevySpace Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-text-on-bg-secondary)', marginBottom: '8px' }}>
              Bon <span style={{ color: 'var(--color-gold)' }}>retour</span>
            </h1>
            <p style={{ color: 'rgba(245, 243, 240, 0.6)', fontSize: '15px' }}>Connectez-vous à votre espace</p>
          </div>

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* EMAIL */}
            <div style={{ position: 'relative' }}>
              <Mail 
                size={20} 
                color={focusedField === 'email' ? '#FFD700' : 'rgba(245, 243, 240, 0.4)'} 
                style={{ 
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  transition: 'color 0.2s ease' 
                }} 
              />
              <input
                type="email"
                placeholder="Adresse email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('email')}
              />
            </div>

            {/* MOT DE PASSE */}
            <div style={{ position: 'relative' }}>
              <Lock 
                size={20} 
                color={focusedField === 'password' ? '#FFD700' : 'rgba(245, 243, 240, 0.4)'} 
                style={{ 
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  transition: 'color 0.2s ease' 
                }} 
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', 
                  border: 'none', background: 'none', cursor: 'pointer', 
                  color: showPassword ? 'var(--color-gold)' : 'rgba(245, 243, 240, 0.4)',
                  transition: 'color 0.2s ease',
                  padding: 0, display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* MOT DE PASSE OUBLIÉ */}
            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '13px', color: 'var(--color-gold)', textDecoration: 'none', fontWeight: '600' }}>
                Mot de passe oublié ?
              </a>
            </div>

            {/* BOUTON CONNEXION */}
            <button
              type="submit"
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--color-gold)', 
                color: 'var(--color-bg)', 
                padding: '18px', 
                borderRadius: '18px', 
                fontSize: '16px', 
                fontWeight: '700', 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                transition: 'transform 0.1s, opacity 0.2s', 
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)'
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>Se connecter <ArrowRight size={20} /></>}
            </button>
          </form>

          {/* LIEN INSCRIPTION */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'rgba(245, 243, 240, 0.6)' }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: 'var(--color-gold)', fontWeight: '700', textDecoration: 'none' }}>
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* COPYRIGHT */}
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'rgba(245, 243, 240, 0.35)' }}>
            &copy; {currentYear} KevySpace v{packageJson.version}. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default Login;