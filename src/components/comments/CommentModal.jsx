// src/components/comments/CommentModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reply, Copy, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

const CommentModal = ({ isOpen, selectedComment, onClose, onReply, onEdit, onDelete, currentUser }) => {
  if (!selectedComment) return null;

  const isOwner = currentUser && (
    selectedComment.user?._id === currentUser.id || 
    selectedComment.user?._id === currentUser._id
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedComment.text);
    onClose();
    toast.success("Copié !");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
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
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-input)', overflow: 'hidden' }}>
                  {selectedComment.user?.profilePicture ? (
                    <img 
                      src={selectedComment.user.profilePicture} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt="" 
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', height: '100%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '10px' 
                    }}>
                      {selectedComment.user?.name?.[0]}
                    </div>
                  )}
                </div>
                <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>
                  {selectedComment.user?.name}
                </span>
              </div>
              <p style={{ 
                fontSize: '13px', color: 'var(--text-primary)', 
                lineHeight: '1.4', maxHeight: '180px', overflowY: 'auto' 
              }}>
                {selectedComment.text}
              </p>
            </div>

            {/* BOUTONS D'ACTIONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ModalButton icon={<Reply size={18}/>} label="Répondre" onClick={onReply} />
              <ModalButton icon={<Copy size={18}/>} label="Copier le texte" onClick={handleCopy} />

              {isOwner && (
                <>
                  <ModalButton icon={<Edit2 size={18}/>} label="Modifier" onClick={onEdit} />
                  <ModalButton icon={<Trash2 size={18}/>} label="Supprimer" danger onClick={onDelete} />
                </>
              )}

              <button 
                onClick={onClose}
                style={{ 
                  marginTop: '4px', background: 'rgba(255,255,255,0.15)', border: 'none', 
                  color: '#FFF', padding: '12px', borderRadius: '14px', 
                  fontWeight: '600', cursor: 'pointer', fontSize: '13px'
                }}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommentModal;