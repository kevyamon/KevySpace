// frontend/src/pages/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext'; // <--- IMPORT
import Button from '../components/Button';
import Input from '../components/Input';

const Register = () => {
  const navigate = useNavigate();
  const { register, user, loading } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext); // <--- RECUPERATION

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    
    // SI L'INSCRIPTION RÉUSSIT
    if (res.success) {
      // ON ENVOIE LA NOTIFICATION DE BIENVENUE
      addNotification({
        type: 'info',
        title: 'Bienvenue sur KevySpace ! 🚀',
        description: `Ravi de vous compter parmi nous ${formData.name}. Votre aventure commence maintenant.`
      });

      navigate('/');
    }
  };

  return (
    <div style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100%', 
      width: '100%' 
    }}>
      
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
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Créer un compte</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
          Rejoignez KevySpace pour commencer.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <Input 
            icon={<User size={20} />} 
            placeholder="Votre nom complet" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <Input 
            type="email"
            icon={<Mail size={20} />} 
            placeholder="Votre adresse email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <Input 
            type="tel"
            icon={<Phone size={20} />} 
            placeholder="Votre numéro (ex: 0707...)" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />

          <Input 
            type="password"
            icon={<Lock size={20} />} 
            placeholder="Mot de passe (6 carac. min)" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <div style={{ marginTop: '16px' }}>
            {/* BOUTON RESPIRANT 👇 */}
            <Button type="submit" fullWidth isLoading={loading} pulse={true}>
              S'inscrire
            </Button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px', fontSize: '14px', color: '#888' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--color-gold-hover)', fontWeight: '600', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;