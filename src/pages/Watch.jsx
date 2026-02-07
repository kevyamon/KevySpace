// src/pages/Watch.jsx
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import CommentsSection from '../components/CommentsSection';
import GlobalLoader from '../components/GlobalLoader';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const hasViewedRef = useRef(false);
  
  // REFS POUR LE LIKE — évite les problèmes de closure
  const isLikedRef = useRef(false);
  const likePendingRef = useRef(false);
  const userIdRef = useRef(null);

  // Synchroniser les refs avec le state
  useEffect(() => {
    isLikedRef.current = isLiked;
  }, [isLiked]);

  useEffect(() => {
    if (user) {
      userIdRef.current = String(user._id || user.id);
    }
  }, [user]);

  // =====================
  // CHARGEMENT + SOCKETS
  // =====================
  useEffect(() => {
    let isMounted = true;
    hasViewedRef.current = false;

    const fetchVideo = async () => {
      try {
        const res = await api.get(`/api/videos/${id}`);
        const data = res.data.data || res.data;
        
        if (isMounted) {
          setVideo(data);
          setViewsCount(data.views || 0);
          setLikesCount(data.likes ? data.likes.length : 0);
          setCommentsCount(data.comments ? data.comments.length : 0);
          
          const liked = user && data.likes ? data.likes.includes(user._id) : false;
          setIsLiked(liked);
          isLikedRef.current = liked;
          
          setLoading(false);
        }
      } catch (err) {
        toast.error("Impossible de charger la vidéo");
        navigate('/');
      }
    };

    if (user) fetchVideo();

    // --- SOCKET IO ---
    const socket = io('https://kevyspace-backend.onrender.com');

    const handleLikeUpdate = (payload) => {
      if (payload.id === id) {
        // Ignorer mes propres actions like (déjà gérées en optimistic UI)
        if (likePendingRef.current) return;

        setLikesCount(payload.likes.length);
        if (user) {
          const myId = userIdRef.current;
          const liked = payload.likes.some(uid => String(uid) === myId);
          setIsLiked(liked);
          isLikedRef.current = liked;
        }
      }
    };

    const handleViewUpdate = (payload) => {
      if (payload.id === id) {
        setViewsCount(payload.views);
      }
    };

    socket.on('video_updated', handleLikeUpdate);
    socket.on('video_viewed', handleViewUpdate);

    return () => { 
      isMounted = false; 
      socket.off('video_updated', handleLikeUpdate);
      socket.off('video_viewed', handleViewUpdate);
      socket.disconnect();
    };
  }, [id, user, navigate]);

  // =====================
  // LIKE — ANTI DOUBLE-CLIC + OPTIMISTIC UI PROPRE
  // =====================
  const handleLike = useCallback(async () => {
    // LOCK : empêcher le double-clic
    if (likePendingRef.current) return;
    likePendingRef.current = true;

    // Lire l'état RÉEL depuis la ref (pas le state)
    const wasLiked = isLikedRef.current;
    
    // Optimistic UI
    const newLiked = !wasLiked;
    setIsLiked(newLiked);
    isLikedRef.current = newLiked;
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    try {
      await api.put(`/api/videos/${id}/like`);
    } catch (err) {
      // ROLLBACK en cas d'erreur
      setIsLiked(wasLiked);
      isLikedRef.current = wasLiked;
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      toast.error("Erreur lors du like");
    } finally {
      // Délai court avant de débloquer — laisse le temps au socket de ne pas interférer
      setTimeout(() => {
        likePendingRef.current = false;
      }, 500);
    }
  }, [id]);

  // =====================
  // VUES
  // =====================
  const handleViewTrigger = async () => {
    if (hasViewedRef.current) return;
    try {
      hasViewedRef.current = true;
      await api.put(`/api/videos/${id}/view`);
    } catch (err) { console.error(err); }
  };

  // =====================
  // PARTAGE
  // =====================
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  if (loading) return <GlobalLoader text="Chargement du cours..." />;
  if (!video) return null;

  return (
    <div style={{ 
      minHeight: '100%', 
      backgroundColor: 'var(--color-bg)', 
      paddingBottom: '40px', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      <VideoPlayer 
        videoUrl={video.videoUrl} 
        thumbnailUrl={video.thumbnailUrl} 
        onPlay={handleViewTrigger} 
      />
      
      <VideoInfo 
        video={{...video, comments: Array(commentsCount).fill(0)}}
        viewsCount={viewsCount} 
        likesCount={likesCount} 
        isLiked={isLiked} 
        onLike={handleLike} 
        onShare={handleShare} 
      />
      
      <div style={{ padding: '0 20px' }}>
        <CommentsSection 
          videoId={video._id} 
          commentsCount={commentsCount}
          setCommentsCount={setCommentsCount}
        />
      </div>
      
    </div>
  );
};

export default Watch;