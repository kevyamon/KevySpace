// frontend/src/pages/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, Phone, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import Button from '../components/Button';
import Input from '../components/Input';

const COUNTRY_CODES = [
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+221', country: 'Sénégal', flag: '🇸🇳' },
  { code: '+237', country: 'Cameroun', flag: '🇨🇲' },
  { code: '+229', country: 'Bénin', flag: '🇧🇯' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+224', country: 'Guinée', flag: '🇬🇳' },
  { code: '+32', country: 'Belgique', flag: '🇧🇪' },
  { code: '+41', country: 'Suisse', flag: '🇨🇭' },
  { code: '+212', country: 'Maroc', flag: '🇲🇦' },
  { code: '+213', country: 'Algérie', flag: '🇩🇿' },
  { code: '+216', country: 'Tunisie', flag: '🇹🇳' },
  { code: '+44', country: 'Royaume-Uni', flag: '🇬🇧' },
];

const Register = () => {
  const navigate = useNavigate();
  const { register, user, loading } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [countryCode, setCountryCode] = useState('+225');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullPhone = `${countryCode}${formData.phone}`;
    const dataToSend = { ...formData, phone: fullPhone };
    
    const res = await register(dataToSend);
    
    if (res.success) {
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
        <ArrowLeft color="var(--color-text-main)" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--color-text-main)', fontWeight: '800' }}>Créer un compte</h1>
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

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              
              <div style={{ position: 'relative', width: '110px' }}>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    width: '100%',
                    height: '56px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 12px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--color-text-main)'
                  }}
                >
                  <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag} {countryCode}</span>
                  <ChevronDown size={16} />
                </button>

                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: '60px',
                      left: 0,
                      right: 0,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      boxShadow: '0 8px 24px var(--shadow-color)',
                      zIndex: 1000
                    }}
                  >
                    {COUNTRY_CODES.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setCountryCode(item.code);
                          setShowDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: countryCode === item.code ? 'var(--bg-input)' : 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          color: 'var(--color-text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{item.flag}</span>
                        <span style={{ fontWeight: '600' }}>{item.code}</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{item.country}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <Input 
                  type="tel"
                  icon={<Phone size={20} />} 
                  placeholder="07 07 07 07 07" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <Input 
            type="password"
            icon={<Lock size={20} />} 
            placeholder="Mot de passe (6 carac. min)" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <div style={{ marginTop: '16px' }}>
            <Button type="submit" fullWidth isLoading={loading} pulse={true}>
              S'inscrire
            </Button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', marginBottom: '24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--color-gold)', fontWeight: '600', textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;