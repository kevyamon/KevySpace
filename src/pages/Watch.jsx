// src/pages/Watch.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

// Composants
import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import CommentsSection from '../components/CommentsSection';
import GlobalLoader from '../components/GlobalLoader'; // <--- IMPORT AJOUTÉ

// 2. CONNEXION SOCKET
const socket = io('https://kevyspace-backend.onrender.com');

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // -- ÉTATS --
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // États synchronisés temps réel
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  
  // NOUVEAU : On gère le compteur de commentaires ici pour l'afficher dans VideoInfo
  const [commentsCount, setCommentsCount] = useState(0);

  const hasViewedRef = useRef(false);

  // 1. CHARGEMENT INITIAL + ÉCOUTE SOCKETS
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
          
          // Initialisation du compteur de commentaires
          setCommentsCount(data.comments ? data.comments.length : 0);
          
          if (user && data.likes) setIsLiked(data.likes.includes(user._id));
          setLoading(false);
        }
      } catch (err) {
        toast.error("Impossible de charger la vidéo");
        navigate('/');
      }
    };

    if (user) fetchVideo();

    // --- 3. LES OREILLES DU SOCKET ---
    const handleLikeUpdate = (payload) => {
        if (payload.id === id) {
            setLikesCount(payload.likes.length);
            if (user) setIsLiked(payload.likes.includes(user._id));
        }
    };

    const handleViewUpdate = (payload) => {
        if (payload.id === id) {
            setViewsCount(payload.views);
        }
    };

    socket.on('video_updated', handleLikeUpdate);
    socket.on('video_viewed', handleViewUpdate); 

    // Nettoyage
    return () => { 
        isMounted = false; 
        socket.off('video_updated', handleLikeUpdate);
        socket.off('video_viewed', handleViewUpdate);
    };

  }, [id, user, navigate]);

  // -- HANDLERS --

  const handleViewTrigger = async () => {
    if (hasViewedRef.current) return;
    try {
        hasViewedRef.current = true;
        await api.put(`/api/videos/${id}/view`);
    } catch (err) { console.error(err); }
  };

  const handleLike = async () => {
    // Optimistic UI
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      await api.put(`/api/videos/${id}/like`);
    } catch (err) {
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev : prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  // --- REMPLACEMENT DU LOADER ICI ---
  if (loading) return <GlobalLoader text="Chargement du cours..." />;
  
  if (!video) return null;

  return (
    <div style={{ minHeight: '100%', backgroundColor: 'var(--color-bg)', paddingBottom: '40px', display: 'flex', flexDirection: 'column' }}>
      
      <VideoPlayer 
        videoUrl={video.videoUrl} 
        thumbnailUrl={video.thumbnailUrl} 
        onPlay={handleViewTrigger} 
      />
      
      {/* On passe le compteur de commentaires (mis à jour par CommentsSection) */}
      <VideoInfo 
        video={{...video, comments: Array(commentsCount).fill(0)}} // Astuce pour que VideoInfo affiche le bon chiffre
        viewsCount={viewsCount} 
        likesCount={likesCount} 
        isLiked={isLiked} 
        onLike={handleLike} 
        onShare={handleShare} 
      />
      
      <div style={{ padding: '0 20px' }}>
        {/* LE FIX EST ICI : On passe videoId et setCommentsCount */}
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