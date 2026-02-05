// frontend/src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

// IMPORT DU LOGO
import logoImg from '../assets/logo.png';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F5F7' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FFF', borderRadius: '32px', padding: '40px 32px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
        >
          {/* LOGO SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', marginBottom: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={logoImg} alt="KevySpace Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1D1D1F', marginBottom: '8px' }}>Bon retour</h1>
            <p style={{ color: '#86868B', fontSize: '15px' }}>Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* EMAIL */}
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="#86868B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="Adresse email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '16px', border: '1px solid #E5E5EA', backgroundColor: '#FAFAFA', fontSize: '16px', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#86868B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '16px 52px 16px 52px', borderRadius: '16px', border: '1px solid #E5E5EA', backgroundColor: '#FAFAFA', fontSize: '16px', outline: 'none', transition: 'all 0.2s' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#86868B' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '13px', color: '#86868B', textDecoration: 'none', fontWeight: '600' }}>Mot de passe oublié ?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#1D1D1F', color: '#FFF', padding: '18px', borderRadius: '18px', fontSize: '16px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'transform 0.1s', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>Se connecter <ArrowRight size={20} /></>}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#86868B' }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: 'var(--color-gold)', fontWeight: '700', textDecoration: 'none' }}>Créer un compte</Link>
            </p>
          </div>
        </motion.div>
      </div>
      
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#C7C7CC' }}>&copy; 2026 KevySpace. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default Login;