// src/components/comments/CommentItem.jsx
import React from 'react';
import { motion } from 'framer-motion';

const CommentItem = ({ comment, currentUser, onStartPress, onEndPress }) => {
  const isMe = currentUser && (comment.user?._id === currentUser.id || comment.user?._id === currentUser._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onTouchStart={() => onStartPress(comment)}
      onTouchEnd={onEndPress}
      onMouseDown={() => onStartPress(comment)}
      onMouseUp={onEndPress}
      onMouseLeave={onEndPress}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex', gap: '12px',
        padding: '12px', borderRadius: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        userSelect: 'none', cursor: 'pointer',
        border: '1px solid rgba(255, 215, 0, 0.08)',
        transition: 'background-color 0.2s'
      }}
    >
      {/* AVATAR */}
      <div style={{ 
        width: '36px', height: '36px', borderRadius: '50%', 
        background: 'rgba(255, 215, 0, 0.15)', 
        overflow: 'hidden', flexShrink: 0,
        border: '1px solid rgba(255, 215, 0, 0.25)' 
      }}>
        {comment.user?.profilePicture ? (
          <img 
            src={comment.user.profilePicture} 
            alt="User" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ 
            width: '100%', height: '100%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '13px' 
          }}>
            {comment.user?.name ? comment.user.name[0].toUpperCase() : '?'}
          </div>
        )}
      </div>

      {/* CONTENU */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-on-bg-secondary)' }}>
            {comment.user?.name || 'Utilisateur'}
            {isMe && (
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
          <span style={{ fontSize: '11px', color: 'rgba(245, 243, 240, 0.4)', flexShrink: 0, marginLeft: '8px' }}>
            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
          </span>
        </div>
        <p style={{ 
          fontSize: '14px', color: 'var(--color-text-on-bg-secondary)', 
          marginTop: '4px', lineHeight: '1.4', wordBreak: 'break-word' 
        }}>
          {comment.text}
        </p>
      </div>
    </motion.div>
  );
};

export default CommentItem;