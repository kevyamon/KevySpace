// src/components/CommentsSection.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Edit2, Reply, Copy, Loader2, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const LONG_PRESS_DURATION = 800; // 0.8s c'est le sweet spot

const CommentsSection = ({ videoId, commentsCount, setCommentsCount }) => {
  const { user } = useContext(AuthContext);
  
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  // États pour la Modale Focus
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/api/videos/${videoId}/comments`);
        setComments(res.data.data || []);
        if (setCommentsCount) setCommentsCount(res.data.count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchComments();
  }, [videoId]);

  // --- GESTION LONG PRESS ---
  const handleTouchStart = (comment) => {
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      setSelectedComment(comment);
      setIsModalOpen(true); // Ouvre la modale
    }, LONG_PRESS_DURATION);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- ACTIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!user) return toast.error("Connectez-vous !");

    if (editMode && selectedComment) {
      handleEditConfirm();
      return;
    }

    const tempId = Date.now();
    const newCommentObj = {
      _id: tempId,
      text: inputText,
      user: { _id: user.id, name: user.name, profilePicture: user.profilePicture },
      createdAt: new Date().toISOString()
    };

    setComments([newCommentObj, ...comments]);
    setInputText('');
    if (setCommentsCount) setCommentsCount(prev => prev + 1);

    try {
      await api.post(`/api/videos/${videoId}/comments`, { text: newCommentObj.text });
      const res = await api.get(`/api/videos/${videoId}/comments`);
      setComments(res.data.data);
    } catch (err) {
      setComments(comments.filter(c => c._id !== tempId));
      toast.error("Erreur envoi.");
    }
  };

  const handleDelete = async () => {
    const previous = [...comments];
    setComments(comments.filter(c => c._id !== selectedComment._id));
    setIsModalOpen(false);
    if (setCommentsCount) setCommentsCount(prev => prev - 1);

    try {
      await api.delete(`/api/comments/${selectedComment._id}`);
      toast.success("Supprimé");
    } catch (err) {
      setComments(previous);
      toast.error("Erreur suppression");
    }
  };

  const handleEditInit = () => {
    setInputText(selectedComment.text);
    setEditMode(true);
    setIsModalOpen(false);
    document.getElementById('comment-input')?.focus();
  };

  const handleEditConfirm = async () => {
    setComments(comments.map(c => c._id === selectedComment._id ? { ...c, text: inputText } : c));
    setEditMode(false);
    setInputText('');
    setSelectedComment(null);
    try {
      await api.put(`/api/comments/${selectedComment._id}`, { text: inputText });
    } catch (err) { toast.error("Erreur modif"); }
  };

  const handleReply = () => {
    setInputText(`@${selectedComment.user.name} `);
    setIsModalOpen(false);
    document.getElementById('comment-input')?.focus();
  };

  return (
    <div style={{ marginTop: '24px', paddingBottom: '80px' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1D1D1F' }}>
          Commentaires <span style={{ color: '#86868B', fontSize: '16px' }}>{comments.length}</span>
        </h3>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <Loader2 className="animate-spin" color="var(--color-gold)" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // EVENTS
              onTouchStart={() => handleTouchStart(comment)}
              onTouchEnd={handleTouchEnd}
              onMouseDown={() => handleTouchStart(comment)}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              style={{
                display: 'flex', gap: '12px',
                padding: '12px', borderRadius: '16px',
                backgroundColor: '#FFF',
                userSelect: 'none', cursor: 'pointer',
                // Un petit effet visuel si on appuie (feedback)
                border: '1px solid transparent'
              }}
              whileTap={{ scale: 0.98, backgroundColor: '#F9F9F9' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F7', overflow: 'hidden', flexShrink: 0 }}>
                {comment.user?.profilePicture ? (
                  <img src={comment.user.profilePicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#888' }}>{comment.user?.name?.[0]}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1D1D1F' }}>
                    {comment.user?.name}
                    {comment.user?._id === user?.id && <span style={{ marginLeft: '6px', fontSize: '10px', background: '#F5F5F7', padding: '2px 6px', borderRadius: '4px' }}>Moi</span>}
                  </span>
                  <span style={{ fontSize: '11px', color: '#AAA' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#424245', marginTop: '4px', lineHeight: '1.4' }}>{comment.text}</p>
              </div>
            </motion.div>
          ))}
          {comments.length === 0 && <p style={{ textAlign: 'center', color: '#AAA', fontSize: '14px', marginTop: '20px' }}>Aucun commentaire pour l'instant.</p>}
        </div>
      )}

      {/* INPUT ZONE */}
      <div style={{ marginTop: '20px' }}>
         {editMode && (
             <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--color-gold)', marginBottom:'4px', fontWeight:'700' }}>
                 <span>Modification...</span>
                 <button onClick={() => { setEditMode(false); setInputText(''); }} style={{ background:'none', border:'none', color:'#FF3B30' }}>Annuler</button>
             </div>
         )}
         <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <input
              id="comment-input"
              type="text"
              placeholder={editMode ? "Modifier..." : "Ajouter un commentaire..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                width: '100%', padding: '16px 50px 16px 20px',
                borderRadius: '24px', border: 'none',
                backgroundColor: '#F5F5F7', fontSize: '15px', outline: 'none',
                boxShadow: editMode ? '0 0 0 2px var(--color-gold)' : 'none'
              }}
            />
            <button 
              type="submit" disabled={!inputText.trim()}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: inputText.trim() ? 'var(--color-gold)' : '#E5E5EA',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default'
              }}
            >
              <Send size={18} color={inputText.trim() ? '#000' : '#AAA'} />
            </button>
         </form>
      </div>

      {/* --- MODALE FOCUS (Long Press) --- */}
      <AnimatePresence>
        {isModalOpen && selectedComment && (
          <>
            {/* 1. BACKDROP FLOU */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              style={{ 
                position: 'fixed', inset: 0, 
                backgroundColor: 'rgba(0,0,0,0.6)', 
                backdropFilter: 'blur(8px)', // L'effet demandé
                zIndex: 99998,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            />

            {/* 2. LE CONTENU FLOTTANT AU CENTRE */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '90%', maxWidth: '350px',
                zIndex: 99999,
                display: 'flex', flexDirection: 'column', gap: '20px'
              }}
            >
              {/* A. CLONE DU COMMENTAIRE (Mise en valeur) */}
              <div style={{ 
                background: '#FFF', padding: '16px', borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F5F5F7', overflow:'hidden' }}>
                      {selectedComment.user?.profilePicture && <img src={selectedComment.user.profilePicture} style={{width:'100%', height:'100%', objectFit:'cover'}} />}
                   </div>
                   <span style={{ fontWeight: '700', fontSize: '14px' }}>{selectedComment.user?.name}</span>
                </div>
                <p style={{ fontSize: '15px', color: '#1D1D1F', lineHeight: '1.5' }}>{selectedComment.text}</p>
              </div>

              {/* B. BOUTONS D'ACTIONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                <ModalButton icon={<Reply size={20}/>} label="Répondre" onClick={handleReply} />
                <ModalButton icon={<Copy size={20}/>} label="Copier" onClick={() => { navigator.clipboard.writeText(selectedComment.text); setIsModalOpen(false); toast.success("Copié"); }} />

                {/* Si c'est MON commentaire */}
                {user && user.id === selectedComment.user._id && (
                  <>
                    <ModalButton icon={<Edit2 size={20}/>} label="Modifier" onClick={handleEditInit} />
                    <ModalButton icon={<Trash2 size={20}/>} label="Supprimer" danger onClick={handleDelete} />
                  </>
                )}

                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ 
                    marginTop: '8px', background: 'rgba(255,255,255,0.2)', border: 'none', 
                    color: '#FFF', padding: '14px', borderRadius: '16px', fontWeight: '600'
                  }}
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

// Bouton spécial pour la modale sombre
const ModalButton = ({ icon, label, onClick, danger }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      width: '100%', padding: '16px',
      backgroundColor: danger ? '#FF3B30' : '#FFF',
      color: danger ? '#FFF' : '#1D1D1F',
      border: 'none', borderRadius: '16px',
      fontSize: '15px', fontWeight: '600', cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}
  >
    {icon} {label}
  </motion.button>
);

export default CommentsSection;