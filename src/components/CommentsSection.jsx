// src/components/CommentsSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { User, Send, Reply, Edit2, Trash2, MoreVertical, X } from 'lucide-react';

const CommentsSection = ({ comments, currentUser, onPostComment, onDeleteComment, onEditComment }) => {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // Pour le menu déroulant
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  const inputRef = useRef(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onPostComment(commentText);
      setCommentText('');
    }
  };

  const handleReply = (userName) => {
    setCommentText(`@${userName} `);
    inputRef.current?.focus();
  };

  const startEdit = (e, comment) => {
    e.stopPropagation(); // Empêche le menu de se fermer immédiatement
    setEditingCommentId(comment._id);
    setEditText(comment.text);
    setActiveMenuId(null);
  };

  const saveEdit = (commentId) => {
    onEditComment(commentId, editText);
    setEditingCommentId(null);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onDeleteComment(id);
    setActiveMenuId(null);
  }

  const toggleMenu = (e, id) => {
    e.stopPropagation(); // Important pour ne pas déclencher le clickOutside
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
        Commentaires <span style={{ color: '#86868B', fontSize: '14px', fontWeight: '500' }}>({comments?.length || 0})</span>
      </h3>

      {/* FORMULAIRE D'AJOUT */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 'bold', flexShrink: 0 }}>
          {currentUser?.name?.charAt(0)}
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Ajouter un commentaire..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: '20px', border: '1px solid #E5E5EA', backgroundColor: '#FAFAFA', fontSize: '14px', outline: 'none' }}
          />
          <button type="submit" disabled={!commentText.trim()} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: commentText.trim() ? 'var(--color-gold)' : '#CCC' }}>
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* LISTE DES COMMENTAIRES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
        {comments && comments.length > 0 ? (
          comments.map((com) => (
            <div key={com._id} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
              
              {/* Avatar */}
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                 {com.user?.avatar && com.user.avatar !== 'no-photo.jpg' ? (
                     <img src={com.user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="avt" />
                 ) : (
                     com.user?.name?.charAt(0) || <User size={16} />
                 )}
              </div>
              
              <div style={{ flex: 1 }}>
                {/* En-tête (Nom + Date + Menu) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>{com.user?.name || "Utilisateur"}</span>
                    <span style={{ fontSize: '11px', color: '#86868B' }}>{new Date(com.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* MENU TROIS POINTS (Seulement si c'est mon commentaire) */}
                  {(currentUser?._id === com.user?._id) && !editingCommentId && (
                    <div style={{ position: 'relative' }}>
                      <button 
                        onClick={(e) => toggleMenu(e, com._id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#86868B' }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      
                      {/* Le Dropdown */}
                      {activeMenuId === com._id && (
                        <div style={{ 
                          position: 'absolute', right: 0, top: '24px', 
                          backgroundColor: '#FFF', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
                          borderRadius: '12px', 
                          zIndex: 10, overflow: 'hidden', minWidth: '120px'
                        }}>
                          <button onClick={(e) => startEdit(e, com)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', background: 'none', fontSize: '13px', color: '#1D1D1F', cursor: 'pointer', textAlign: 'left', ':hover': {background: '#F5F5F7'} }}>
                            <Edit2 size={14} /> Modifier
                          </button>
                          <button onClick={(e) => handleDelete(e, com._id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', background: 'none', fontSize: '13px', color: '#FF3B30', cursor: 'pointer', textAlign: 'left' }}>
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Contenu ou Mode Édition */}
                {editingCommentId === com._id ? (
                  <div style={{ marginBottom: '6px' }}>
                    <textarea 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)} 
                        autoFocus 
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-gold)', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px' }} 
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button onClick={() => saveEdit(com._id)} style={{ fontSize: '11px', fontWeight: 'bold', color: '#FFF', background: 'var(--color-gold)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Enregistrer</button>
                      <button onClick={() => setEditingCommentId(null)} style={{ fontSize: '11px', color: '#1D1D1F', background: '#F2F2F7', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Annuler</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{com.text}</p>
                )}

                {/* Bouton Répondre (Toujours visible) */}
                {!editingCommentId && (
                    <div style={{ marginTop: '6px' }}>
                    <button onClick={() => handleReply(com.user?.name)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '11px', fontWeight: '600', color: '#86868B', cursor: 'pointer' }}>
                        <Reply size={14} /> Répondre
                    </button>
                    </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', fontStyle: 'italic', marginTop: '10px' }}>Soyez le premier à commenter !</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;