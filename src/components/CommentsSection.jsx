// src/components/CommentsSection.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Edit2, Reply, Copy, Loader2, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const LONG_PRESS_DURATION = 800; 

const CommentsSection = ({ videoId, commentsCount, setCommentsCount }) => {
  const { user } = useContext(AuthContext);
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false); 

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) return;
      try {
        setLoading(true);
        const res = await api.get(`/api/videos/${videoId}/comments`);
        setComments(res.data.data || []);
        
        if (setCommentsCount) setCommentsCount(res.data.count || 0);
      } catch (err) {
        console.error("Erreur chargement commentaires", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleStartPress = (comment) => {
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      setSelectedComment(comment);
      setIsModalOpen(true);
    }, LONG_PRESS_DURATION);
  };

  const handleEndPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!user) return toast.error("Connectez-vous pour participer !");

    if (editMode && selectedComment) {
      handleEditConfirm();
      return;
    }

    const tempId = Date.now().toString();
    const newCommentObj = {
      _id: tempId,
      text: inputText,
      user: { 
        _id: user.id || user._id, 
        name: user.name, 
        profilePicture: user.profilePicture 
      },
      createdAt: new Date().toISOString()
    };

    setComments([newCommentObj, ...comments]);
    setInputText('');
    if (setCommentsCount) setCommentsCount(prev => prev + 1);

    try {
      const res = await api.post(`/api/videos/${videoId}/comments`, { text: newCommentObj.text });
      const savedComment = res.data.data; 
      setComments(prev => prev.map(c => c._id === tempId ? savedComment : c));
    } catch (err) {
      setComments(prev => prev.filter(c => c._id !== tempId));
      toast.error("Erreur lors de l'envoi.");
      if (setCommentsCount) setCommentsCount(prev => prev - 1);
    }
  };

  const handleDelete = async () => {
    if (!selectedComment) return;
    const previousComments = [...comments];
    setComments(comments.filter(c => c._id !== selectedComment._id));
    setIsModalOpen(false);
    if (setCommentsCount) setCommentsCount(prev => prev - 1);

    try {
      await api.delete(`/api/comments/${selectedComment._id}`);
      toast.success("Supprimé");
    } catch (err) {
      setComments(previousComments);
      toast.error("Impossible de supprimer");
      if (setCommentsCount) setCommentsCount(prev => prev + 1);
    }
  };

  const handleEditInit = () => {
    setInputText(selectedComment.text);
    setEditMode(true);
    setIsModalOpen(false);
    setTimeout(() => document.getElementById('comment-input')?.focus(), 100);
  };

  const handleEditConfirm = async () => {
    const originalComments = [...comments];
    setComments(comments.map(c => c._id === selectedComment._id ? { ...c, text: inputText } : c));
    setEditMode(false);
    setInputText('');
    setSelectedComment(null);

    try {
      await api.put(`/api/comments/${selectedComment._id}`, { text: inputText });
    } catch (err) {
      setComments(originalComments);
      toast.error("Erreur modification");
    }
  };

  const handleReply = () => {
    setInputText(`@${selectedComment.user?.name || 'User'} `);
    setIsModalOpen(false);
    setTimeout(() => document.getElementById('comment-input')?.focus(), 100);
  };

  return (
    <div style={{ marginTop: '24px', paddingBottom: '100px' }}>
      
      {/* HEADER COMPTEUR */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-gold)' }}>
          Commentaires <span style={{ color: 'rgba(245, 243, 240, 0.5)', fontSize: '16px' }}>{comments.length}</span>
        </h3>
      </div>

      {/* LISTE DES COMMENTAIRES */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <Loader2 className="animate-spin" color="var(--color-gold)" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onTouchStart={() => handleStartPress(comment)}
                onTouchEnd={handleEndPress}
                onMouseDown={() => handleStartPress(comment)}
                onMouseUp={handleEndPress}
                onMouseLeave={handleEndPress}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex', gap: '12px',
                  padding: '12px', borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  userSelect: 'none', cursor: 'pointer',
                  border: '1px solid rgba(255, 215, 0, 0.1)'
                }}
              >
                {/* AVATAR */}
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: 'rgba(255, 215, 0, 0.15)', 
                  overflow: 'hidden', flexShrink: 0,
                  border: '1px solid rgba(255, 215, 0, 0.25)' 
                }}>
                  {comment.user?.profilePicture ? (
                    <img src={comment.user.profilePicture} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '14px' }}>
                      {comment.user?.name ? comment.user.name[0].toUpperCase() : '?'}
                    </div>
                  )}
                </div>

                {/* TEXTE */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-on-bg-secondary)' }}>
                      {comment.user?.name || 'Utilisateur'}
                      {user && (comment.user?._id === user.id || comment.user?._id === user._id) && (
                        <span style={{ 
                          marginLeft: '6px', fontSize: '10px', 
                          background: 'rgba(255, 215, 0, 0.15)', 
                          padding: '2px 6px', borderRadius: '4px', 
                          color: 'var(--color-gold)' 
                        }}>
                          Moi
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(245, 243, 240, 0.4)' }}>
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-on-bg-secondary)', marginTop: '4px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'rgba(245, 243, 240, 0.5)', fontSize: '14px', marginTop: '20px' }}>
              Aucun commentaire. Soyez le premier ! 👇
            </p>
          )}
        </div>
      )}

      {/* INPUT ZONE */}
      <div style={{ marginTop: '20px' }}>
         {editMode && (
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-gold)', marginBottom: '4px', fontWeight: '700' }}>
                 <span>Modification en cours...</span>
                 <button onClick={() => { setEditMode(false); setInputText(''); }} style={{ background: 'none', border: 'none', color: '#FF3B30', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Annuler</button>
             </div>
         )}
         <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
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
                boxShadow: editMode ? '0 0 0 2px var(--color-gold)' : (inputFocused ? '0 4px 20px rgba(255, 215, 0, 0.15)' : 'none'),
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
            />
            <button 
              type="submit" disabled={!inputText.trim()}
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

      {/* --- MODALE FOCUS (ON GARDE EN SURFACE BLANCHE - C'EST UNE OVERLAY) --- */}
      <AnimatePresence>
        {isModalOpen && selectedComment && (
          <div style={{ 
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}>
            
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ 
                position: 'absolute', inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)', 
              }}
            />

            {/* CONTENU FLOTTANT */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                position: 'relative',
                width: '100%', maxWidth: '300px',
                display: 'flex', flexDirection: 'column', gap: '14px'
              }}
            >
              {/* CLONE DU COMMENTAIRE */}
              <div style={{ 
                background: 'var(--bg-surface)', 
                padding: '14px',
                borderRadius: '18px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                   <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-input)', overflow: 'hidden' }}>
                      {selectedComment.user?.profilePicture ? (
                          <img src={selectedComment.user.profilePicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '10px' }}>
                            {selectedComment.user?.name?.[0]}
                          </div>
                      )}
                   </div>
                   <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{selectedComment.user?.name}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4', maxHeight: '180px', overflowY: 'auto' }}>
                    {selectedComment.text}
                </p>
              </div>

              {/* BOUTONS D'ACTIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                <ModalButton icon={<Reply size={18}/>} label="Répondre" onClick={handleReply} />
                
                <ModalButton icon={<Copy size={18}/>} label="Copier le texte" onClick={() => { 
                    navigator.clipboard.writeText(selectedComment.text); 
                    setIsModalOpen(false); 
                    toast.success("Copié !"); 
                }} />

                {user && (selectedComment.user?._id === user.id || selectedComment.user?._id === user._id) && (
                  <>
                    <ModalButton icon={<Edit2 size={18}/>} label="Modifier" onClick={handleEditInit} />
                    <ModalButton icon={<Trash2 size={18}/>} label="Supprimer" danger onClick={handleDelete} />
                  </>
                )}

                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ 
                    marginTop: '4px', background: 'rgba(255,255,255,0.15)', border: 'none', 
                    color: '#FFF', padding: '12px', borderRadius: '14px', fontWeight: '600', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Bouton interne pour la modale (reste en surface blanche - c'est une overlay)
const ModalButton = ({ icon, label, onClick, danger }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      width: '100%', padding: '12px',
      backgroundColor: danger ? '#FF3B30' : 'var(--bg-surface)',
      color: danger ? '#FFF' : 'var(--text-primary)',
      border: 'none', borderRadius: '14px',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}
  >
    {icon} {label}
  </motion.button>
);

export default CommentsSection;