// src/components/CommentsSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { User, Send, Reply, Edit2, Trash2, X } from 'lucide-react';

const CommentsSection = ({ comments, currentUser, onPostComment, onDeleteComment, onEditComment }) => {
  const [commentText, setCommentText] = useState('');
  
  // États pour l'édition standard
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // États pour le "Long Press" (Appui long)
  const [focusedCommentId, setFocusedCommentId] = useState(null); 
  const timerRef = useRef(null); 

  const inputRef = useRef(null);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // --- GESTION DU TIMER (3 SECONDES) ---
  const startPress = (commentId) => {
    if (!isOwner(commentId)) return;
    
    timerRef.current = setTimeout(() => {
      setFocusedCommentId(commentId); 
      if (navigator.vibrate) navigator.vibrate(50); 
    }, 1000); // J'ai réduit à 1 seconde (3s c'est trop long en UX mobile, on croit que ça marche pas)
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- ACTIONS ---

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

  const startEditFromModal = (comment) => {
    setFocusedCommentId(null); 
    setEditingCommentId(comment._id); 
    setEditText(comment.text);
  };

  const saveEdit = (commentId) => {
    onEditComment(commentId, editText);
    setEditingCommentId(null);
  };

  const handleDeleteFromModal = (commentId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      onDeleteComment(commentId);
      setFocusedCommentId(null); 
    }
  };

  const isOwner = (commentId) => {
    if (!currentUser || !currentUser._id) return false;
    const comment = comments.find(c => c._id === commentId);
    if (!comment || !comment.user) return false;

    const commentUserId = comment.user._id ? comment.user._id : comment.user;
    return String(currentUser._id) === String(commentUserId);
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
            placeholder="Maintenez un commentaire pour modifier..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: '20px', border: '1px solid #E5E5EA', backgroundColor: '#FAFAFA', fontSize: '14px', outline: 'none' }}
          />
          <button type="submit" disabled={!commentText.trim()} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: commentText.trim() ? 'var(--color-gold)' : '#CCC' }}>
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* --- MODALE DE FOCUS (Appui long) --- */}
      {focusedCommentId && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
          }}
          onClick={() => setFocusedCommentId(null)} 
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              width: '85%', maxWidth: '400px',
              backgroundColor: '#FFF', borderRadius: '24px', padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              transform: 'scale(1.1)', 
              transition: 'transform 0.2s',
              textAlign: 'center', position: 'relative'
            }}
          >
             <button 
               onClick={() => setFocusedCommentId(null)}
               style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#CCC' }}
             >
               <X size={20} />
             </button>

             <p style={{ fontSize: '16px', color: '#1D1D1F', lineHeight: '1.5', marginBottom: '32px', fontWeight: '500' }}>
               {comments.find(c => c._id === focusedCommentId)?.text}
             </p>

             <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => startEditFromModal(comments.find(c => c._id === focusedCommentId))}
                    style={{ 
                      width: '56px', height: '56px', borderRadius: '50%', 
                      backgroundColor: '#F5F5F7', color: '#1D1D1F',
                      border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Edit2 size={24} />
                  </button>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#86868B' }}>Modifier</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => handleDeleteFromModal(focusedCommentId)}
                    style={{ 
                      width: '56px', height: '56px', borderRadius: '50%', 
                      backgroundColor: '#FFF0F0', color: '#FF3B30',
                      border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 59, 48, 0.2)'
                    }}
                  >
                    <Trash2 size={24} />
                  </button>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#FF3B30' }}>Supprimer</span>
                </div>
             </div>
          </div>
        </div>
      )}


      {/* LISTE DES COMMENTAIRES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '4px' }}>
        {comments && comments.length > 0 ? (
          comments.map((com) => {
            const safeDate = com.createdAt ? new Date(com.createdAt) : new Date();
            const isMyComment = isOwner(com._id);

            return (
              <div 
                key={com._id} 
                // --- INTERACTION : APPUI LONG ---
                onMouseDown={() => isMyComment && startPress(com._id)}
                onMouseUp={clearTimer}
                onMouseLeave={clearTimer}
                
                onTouchStart={() => isMyComment && startPress(com._id)}
                onTouchEnd={clearTimer}
                onTouchMove={clearTimer} // <--- Si on scrolle, on annule (évite les déclenchements involontaires)
                
                // --- LE FIX "CE TRUC VIENT" ---
                onContextMenu={(e) => {
                    // Si c'est mon commentaire, je désactive le menu natif (clic droit / menu système)
                    // pour laisser la place à mon modale
                    if (isMyComment) e.preventDefault(); 
                }}
                // --------------------------------

                style={{ 
                  display: 'flex', gap: '12px', position: 'relative',
                  cursor: isMyComment ? 'pointer' : 'default', // Changé 'grab' en 'pointer' pour être plus standard
                  userSelect: 'none', 
                  WebkitUserSelect: 'none' // Pour Safari Mobile
                }}
              >
                
                {/* Avatar */}
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                   {com.user?.avatar && com.user.avatar !== 'no-photo.jpg' ? (
                       <img src={com.user.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="avt" />
                   ) : (
                       com.user?.name?.charAt(0) || <User size={16} />
                   )}
                </div>
                
                <div style={{ flex: 1 }}>
                  {/* En-tête */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>{com.user?.name || "Utilisateur"}</span>
                      <span style={{ fontSize: '11px', color: '#86868B' }}>{safeDate.toLocaleDateString()}</span>
                    </div>
                  </div>

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
                    <div>
                        <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{com.text}</p>
                        
                        {isMyComment && (
                             <div style={{ fontSize:'10px', color:'#CCC', marginTop:'4px', fontStyle:'italic' }}>
                                (Maintenir pour modifier)
                             </div>
                        )}

                        <div style={{ marginTop: '6px' }}>
                            <button onClick={() => handleReply(com.user?.name)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', fontSize: '11px', fontWeight: '600', color: '#86868B', cursor: 'pointer' }}>
                                <Reply size={14} /> Répondre
                            </button>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', fontStyle: 'italic', marginTop: '10px' }}>Soyez le premier à commenter !</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;