// src/components/comments/CommentInput.jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';

const CommentInput = ({ inputText, setInputText, onSubmit, editMode, onCancelEdit }) => {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div style={{ marginTop: '12px' }}>
      {/* BARRE D'ÉDITION */}
      {editMode && (
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', 
          fontSize: '12px', color: 'var(--color-gold)', 
          marginBottom: '4px', fontWeight: '700' 
        }}>
          <span>Modification en cours...</span>
          <button 
            onClick={onCancelEdit} 
            style={{ 
              background: 'none', border: 'none', color: '#FF3B30', 
              cursor: 'pointer', fontSize: '12px', fontWeight: '700' 
            }}
          >
            Annuler
          </button>
        </div>
      )}

      {/* FORMULAIRE */}
      <form onSubmit={onSubmit} style={{ position: 'relative' }}>
        <input
          id="comment-input"
          type="text"
          placeholder={editMode ? "Modifier votre message..." : "Ajouter un commentaire..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          style={{
            width: '100%', padding: '16px 50px 16px 20px',
            borderRadius: '24px', 
            border: inputFocused ? '1px solid var(--color-gold)' : '1px solid rgba(255, 215, 0, 0.2)',
            backgroundColor: inputFocused ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
            color: 'var(--color-text-on-bg-secondary)',       
            fontSize: '15px', outline: 'none',
            boxShadow: editMode 
              ? '0 0 0 2px var(--color-gold)' 
              : (inputFocused ? '0 4px 20px rgba(255, 215, 0, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            fontFamily: 'inherit'
          }}
        />
        <button 
          type="submit" 
          disabled={!inputText.trim()}
          style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: inputText.trim() ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.1)', 
            border: inputText.trim() ? 'none' : '1px solid rgba(255, 215, 0, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'background-color 0.2s'
          }}
        >
          <Send size={18} color={inputText.trim() ? 'var(--color-bg)' : 'rgba(245, 243, 240, 0.4)'} />
        </button>
      </form>
    </div>
  );
};

export default CommentInput;