// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login, error, setError, user } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate('/');
    setError(null);
  }, [user, navigate, setError]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate('/'); 
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', 
          marginBottom: '24px', width: 'fit-content' 
        }}
      >
        <ArrowLeft color="#1D1D1F" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Bon retour !</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Connectez-vous pour accéder à vos cours.
        </p>

        {error && (
          <div style={{ 
            padding: '12px', background: '#FFE5E5', color: '#D00', 
            borderRadius: '12px', marginBottom: '20px', fontSize: '14px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            type="email"
            icon={<Mail size={20} />} 
            placeholder="Votre adresse email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            type="password"
            icon={<Lock size={20} />} 
            placeholder="Votre mot de passe" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <div style={{ marginTop: '16px' }}>
            <Button type="submit" fullWidth>
              Se connecter
            </Button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--color-gold-hover)', fontWeight: '600', textDecoration: 'none' }}>
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;