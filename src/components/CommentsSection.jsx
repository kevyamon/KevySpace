// src/components/CommentsSection.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

import CommentItem from './comments/CommentItem';
import CommentInput from './comments/CommentInput';
import CommentModal from './comments/CommentModal';

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

  const timerRef = useRef(null);
  const commentsListRef = useRef(null);
  const userIdRef = useRef(null);

  // Stocker l'ID user dans une ref pour éviter les problèmes de closure
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

    // --- CONNEXION SOCKET ---
    const socket = io('https://kevyspace-backend.onrender.com');

    const handleCommentAction = (payload) => {
      // On ne traite que les événements pour CETTE vidéo
      if (payload.videoId !== videoId) return;

      const myId = userIdRef.current;

      if (payload.type === 'add') {
        // Éviter les doublons : si c'est MON commentaire, je l'ai déjà ajouté en optimistic UI
        if (payload.userId === myId) return;

        setComments(prev => {
          // Vérifier qu'il n'existe pas déjà
          const exists = prev.some(c => String(c._id) === String(payload.data._id));
          if (exists) return prev;
          return [payload.data, ...prev];
        });
        if (setCommentsCount) setCommentsCount(prev => prev + 1);
      }

      if (payload.type === 'update') {
        // Si c'est MON edit, je l'ai déjà mis à jour en optimistic UI
        if (payload.userId === myId) return;

        setComments(prev => prev.map(c => 
          String(c._id) === String(payload.data._id) ? payload.data : c
        ));
      }

      if (payload.type === 'delete') {
        // Si c'est MA suppression, je l'ai déjà retiré en optimistic UI
        if (payload.userId === myId) return;

        setComments(prev => prev.filter(c => String(c._id) !== String(payload.id)));
        if (setCommentsCount) setCommentsCount(prev => Math.max(0, prev - 1));
      }
    };

    socket.on('comment_action', handleCommentAction);

    // --- NETTOYAGE ---
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
    if (setCommentsCount) setCommentsCount(prev => prev + 1);

    if (commentsListRef.current) {
      commentsListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const res = await api.post(`/api/videos/${videoId}/comments`, { text: newCommentObj.text });
      const savedComment = res.data.data;
      // Remplacer le commentaire temporaire par le vrai
      setComments(prev => prev.map(c => c._id === tempId ? savedComment : c));
    } catch (err) {
      // Rollback
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
  // RÉPONDRE
  // =====================
  const handleReply = () => {
    setInputText(`@${selectedComment.user?.name || 'User'} `);
    setIsModalOpen(false);
    setTimeout(() => document.getElementById('comment-input')?.focus(), 100);
  };

  // =====================
  // ANNULER ÉDITION
  // =====================
  const handleCancelEdit = () => {
    setEditMode(false);
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
            {comments.length}
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
          padding: comments.length > 0 ? '12px' : '0'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
            <Loader2 className="animate-spin" color="var(--color-gold)" />
          </div>
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
      {comments.length > 5 && (
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