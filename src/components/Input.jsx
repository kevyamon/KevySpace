// src/components/Input.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon, 
  required = false 
}) => {
  // État pour savoir si on montre le mot de passe ou non
  const [showPassword, setShowPassword] = useState(false);

  // Est-ce un champ mot de passe ?
  const isPassword = type === 'password';

  // Si c'est un mot de passe et qu'on veut le voir, on le passe en 'text', sinon on garde le type original
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* ICÔNE DE GAUCHE (Mail, User, Phone...) */}
      {icon && (
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#8E8E93',
          display: 'flex',
          zIndex: 1
        }}>
          {icon}
        </div>
      )}

      {/* CHAMP DE SAISIE */}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '16px',
          paddingLeft: icon ? '48px' : '16px', // Place pour icône gauche
          paddingRight: isPassword ? '48px' : '16px', // Place pour l'œil à droite
          borderRadius: '16px',
          border: 'none',
          backgroundColor: '#FFFFFF',
          fontSize: '16px',
          color: 'var(--color-text-main)',
          outline: 'none',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit'
        }}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--color-gold)'}
        onBlur={(e) => e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)'}
      />

      {/* BOUTON ŒIL (Uniquement pour les mots de passe) */}
      {isPassword && (
        <button
          type="button" // Important pour ne pas soumettre le formulaire
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8E8E93',
            display: 'flex',
            padding: 0
          }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default Input;