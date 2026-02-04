import React, { useState, useRef } from 'react';
import { User, Send, Reply, Edit2, Trash2 } from 'lucide-react';

const CommentsSection = ({ comments, currentUser, onPostComment, onDeleteComment, onEditComment }) => {
  // États déplacés ici pour alléger Watch.jsx
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onPostComment(commentText); // On appelle le parent juste pour l'API
      setCommentText('');
    }
  };

  const handleReply = (userName) => {
    setCommentText(`@${userName} `);
    inputRef.current?.focus();
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = (commentId) => {
    onEditComment(commentId, editText);
    setEditingCommentId(null);
  };

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
        Commentaires <span style={{ color: '#86868B', fontSize: '14px', fontWeight: '500' }}>({comments?.length || 0})</span>
      </h3>

      {/* FORMULAIRE */}
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

      {/* LISTE AVEC SCROLL INTERNE (Ton exigence) */}
      <div style={{ 
        display: 'flex', flexDirection: 'column', gap: '20px', 
        // C'est ici qu'on définit le scroll interne de la liste uniquement
        maxHeight: '500px', 
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {comments && comments.length > 0 ? (
          comments.map((com) => (
            <div key={com._id} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>
                {com.user?.name?.charAt(0) || <User size={16} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>{com.user?.name || "Utilisateur"}</span>
                  <span style={{ fontSize: '11px', color: '#86868B' }}>{new Date(com.createdAt).toLocaleDateString()}</span>
                </div>

                {editingCommentId === com._id ? (
                  <div style={{ marginBottom: '6px' }}>
                    <input value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-gold)', fontSize: '13px' }} />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button onClick={() => saveEdit(com._id)} style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-gold)', background: 'none', border: 'none' }}>SAUVER</button>
                      <button onClick={() => setEditingCommentId(null)} style={{ fontSize: '11px', color: '#888', background: 'none', border: 'none' }}>ANNULER</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4' }}>{com.text}</p>
                )}

                <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                  <button onClick={() => handleReply(com.user?.name)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '11px', fontWeight: '600', color: '#666', cursor: 'pointer' }}><Reply size={14} /> Répondre</button>
                  {(currentUser?._id === com.user?._id) && (
                    <>
                      <button onClick={() => startEdit(com)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '11px', fontWeight: '600', color: '#666', cursor: 'pointer' }}><Edit2 size={14} /></button>
                      <button onClick={() => onDeleteComment(com._id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '11px', fontWeight: '600', color: '#666', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
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