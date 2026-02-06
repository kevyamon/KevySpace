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
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
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
          color: isFocused ? 'var(--color-gold)' : 'rgba(245, 243, 240, 0.4)',
          display: 'flex',
          zIndex: 1,
          transition: 'color 0.2s ease'
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
          paddingLeft: icon ? '48px' : '16px',
          paddingRight: isPassword ? '48px' : '16px',
          borderRadius: '16px',
          border: isFocused ? '1px solid var(--color-gold)' : '1px solid rgba(255, 215, 0, 0.2)',
          backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
          fontSize: '16px',
          color: 'var(--color-text-on-bg-secondary)',
          outline: 'none',
          boxShadow: isFocused ? '0 4px 20px rgba(255, 215, 0, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit'
        }}
        onFocus={(e) => {
          setIsFocused(true);
        }}
        onBlur={(e) => {
          setIsFocused(false);
        }}
      />

      {/* BOUTON ŒIL (Uniquement pour les mots de passe) */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: showPassword ? 'var(--color-gold)' : 'rgba(245, 243, 240, 0.4)',
            display: 'flex',
            padding: 0,
            transition: 'color 0.2s ease'
          }}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default Input;