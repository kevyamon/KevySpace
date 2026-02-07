// src/components/CommentsSection.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

import CommentItem from './comments/CommentItem';
import CommentInput from './comments/CommentInput';
import CommentModal from './comments/CommentModal';
import CommentSkeleton from './comments/CommentSkeleton';

const LONG_PRESS_DURATION = 800;
const COMMENTS_CONTAINER_HEIGHT = '400px';

const CommentsSection = ({ videoId, commentsCount, setCommentsCount }) => {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // NOUVEAU : Stocker l'ID du commentaire parent pour les réponses
  const [replyingTo, setReplyingTo] = useState(null);

  const timerRef = useRef(null);
  const commentsListRef = useRef(null);
  const userIdRef = useRef(null);

  useEffect(() => {
    if (user) {
      userIdRef.current = String(user._id || user.id);
    }
  }, [user]);

  // =====================
  // CHARGEMENT + SOCKET
  // =====================
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

    const socket = io('https://kevyspace-backend.onrender.com');

    const handleCommentAction = (payload) => {
      if (payload.videoId !== videoId) return;

      const myId = userIdRef.current;

      if (payload.type === 'add') {
        if (payload.userId === myId) return;
        setComments(prev => {
          const exists = prev.some(c => String(c._id) === String(payload.data._id));
          if (exists) return prev;
          return [payload.data, ...prev];
        });
        if (setCommentsCount) setCommentsCount(prev => prev + 1);
      }

      if (payload.type === 'update') {
        if (payload.userId === myId) return;
        setComments(prev => prev.map(c => 
          String(c._id) === String(payload.data._id) ? payload.data : c
        ));
      }

      if (payload.type === 'delete') {
        if (payload.userId === myId) return;
        setComments(prev => prev.filter(c => String(c._id) !== String(payload.id)));
        if (setCommentsCount) setCommentsCount(prev => Math.max(0, prev - 1));
      }
    };

    socket.on('comment_action', handleCommentAction);

    return () => {
      socket.off('comment_action', handleCommentAction);
      socket.disconnect();
    };
  }, [videoId]);

  // =====================
  // LONG PRESS
  // =====================
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

  // =====================
  // CRÉER / MODIFIER
  // =====================
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
    const currentReplyingTo = replyingTo;
    setReplyingTo(null);
    if (setCommentsCount) setCommentsCount(prev => prev + 1);

    if (commentsListRef.current) {
      commentsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      // Construire le payload avec parentComment si c'est une réponse
      const payload = { text: newCommentObj.text };
      if (currentReplyingTo) {
        payload.parentComment = currentReplyingTo;
      }

      const res = await api.post(`/api/videos/${videoId}/comments`, payload);
      const savedComment = res.data.data;
      setComments(prev => prev.map(c => c._id === tempId ? savedComment : c));
    } catch (err) {
      setComments(prev => prev.filter(c => c._id !== tempId));
      toast.error("Erreur lors de l'envoi.");
      if (setCommentsCount) setCommentsCount(prev => prev - 1);
    }
  };

  // =====================
  // SUPPRIMER
  // =====================
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

  // =====================
  // ÉDITER
  // =====================
  const handleEditInit = () => {
    setInputText(selectedComment.text);
    setEditMode(true);
    setReplyingTo(null);
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

  // =====================
  // RÉPONDRE — STOCKE L'ID PARENT
  // =====================
  const handleReply = () => {
    const parentId = selectedComment._id;
    const parentName = selectedComment.user?.name || 'User';
    
    setReplyingTo(parentId);
    setInputText(`@${parentName} `);
    setEditMode(false);
    setIsModalOpen(false);
    setTimeout(() => document.getElementById('comment-input')?.focus(), 100);
  };

  // =====================
  // ANNULER
  // =====================
  const handleCancelEdit = () => {
    setEditMode(false);
    setReplyingTo(null);
    setInputText('');
  };

  // =====================
  // RENDU
  // =====================
  return (
    <div style={{
      marginTop: '24px',
      paddingBottom: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* HEADER */}
      <div style={{
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontSize: '18px', fontWeight: '800', color: 'var(--color-gold)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <MessageCircle size={20} />
          Commentaires
          <span style={{ color: 'rgba(245, 243, 240, 0.5)', fontSize: '16px' }}>
            {loading ? '...' : comments.length}
          </span>
        </h3>
      </div>

      {/* ZONE SCROLLABLE */}
      <div
        ref={commentsListRef}
        style={{
          maxHeight: COMMENTS_CONTAINER_HEIGHT,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '16px',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          padding: '12px'
        }}
      >
        {loading ? (
          <CommentSkeleton count={4} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUser={user}
                  onStartPress={handleStartPress}
                  onEndPress={handleEndPress}
                />
              ))
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '40px 20px', textAlign: 'center'
              }}>
                <MessageCircle size={32} color="rgba(255, 215, 0, 0.3)" style={{ marginBottom: '12px' }} />
                <p style={{ color: 'rgba(245, 243, 240, 0.5)', fontSize: '14px' }}>
                  Aucun commentaire. Soyez le premier ! 👇
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INDICATEUR SCROLL */}
      {!loading && comments.length > 5 && (
        <div style={{
          textAlign: 'center',
          padding: '8px 0 4px 0',
          fontSize: '11px',
          color: 'rgba(245, 243, 240, 0.3)',
          fontWeight: '500'
        }}>
          ↕ Scrollez pour voir plus de commentaires
        </div>
      )}

      {/* INDICATEUR DE RÉPONSE */}
      {replyingTo && !editMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          marginTop: '8px',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          fontSize: '12px',
          color: 'var(--color-gold)',
          fontWeight: '600'
        }}>
          <span>↩ Réponse à un commentaire</span>
          <button
            onClick={() => { setReplyingTo(null); setInputText(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF3B30',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            Annuler
          </button>
        </div>
      )}

      {/* INPUT */}
      <CommentInput
        inputText={inputText}
        setInputText={setInputText}
        onSubmit={handleSubmit}
        editMode={editMode}
        onCancelEdit={handleCancelEdit}
      />

      {/* MODALE ACTIONS */}
      <CommentModal
        isOpen={isModalOpen}
        selectedComment={selectedComment}
        onClose={() => setIsModalOpen(false)}
        onReply={handleReply}
        onEdit={handleEditInit}
        onDelete={handleDelete}
        currentUser={user}
      />
    </div>
  );
};

export default CommentsSection;