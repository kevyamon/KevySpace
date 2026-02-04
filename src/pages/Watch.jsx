// src/pages/Watch.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import io from 'socket.io-client'; // 1. IMPORT OBLIGATOIRE

// Composants
import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import CommentsSection from '../components/CommentsSection';

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
          if (user && data.likes) setIsLiked(data.likes.includes(user._id));
          setLoading(false);
        }
      } catch (err) {
        toast.error("Impossible de charger la vidéo");
        navigate('/');
      }
    };

    if (user) fetchVideo();

    // --- 3. LES OREILLES DU SOCKET (C'EST ICI QUE ÇA SE PASSE) ---
    
    // A. Écoute des Likes
    const handleLikeUpdate = (payload) => {
        if (payload.id === id) { // Si ça concerne CETTE vidéo
            setLikesCount(payload.likes.length);
            if (user) setIsLiked(payload.likes.includes(user._id));
        }
    };

    // B. Écoute des Commentaires
    const handleCommentsUpdate = (payload) => {
        if (payload.id === id) {
             setVideo(prev => ({ ...prev, comments: payload.comments }));
        }
    };

    // C. Écoute des Vues (NOUVEAU)
    const handleViewUpdate = (payload) => {
        if (payload.id === id) {
            setViewsCount(payload.views);
        }
    };

    socket.on('video_updated', handleLikeUpdate);
    socket.on('video_comments_updated', handleCommentsUpdate);
    socket.on('video_viewed', handleViewUpdate); // On écoute les vues

    // Nettoyage
    return () => { 
        isMounted = false; 
        socket.off('video_updated', handleLikeUpdate);
        socket.off('video_comments_updated', handleCommentsUpdate);
        socket.off('video_viewed', handleViewUpdate);
    };

  }, [id, user, navigate]);

  // -- HANDLERS (Envoient les ordres, mais n'attendent pas forcément le retour pour l'affichage local car le Socket le fera) --

  const handleViewTrigger = async () => {
    if (hasViewedRef.current) return;
    try {
        hasViewedRef.current = true;
        await api.put(`/api/videos/${id}/view`);
        // Pas besoin de setState ici, le socket 'video_viewed' va nous le renvoyer !
    } catch (err) { console.error(err); }
  };

  const handleLike = async () => {
    // Optimistic UI pour la réactivité immédiate (sensation de vitesse)
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      await api.put(`/api/videos/${id}/like`);
      // Le socket confirmera la vraie valeur juste après
    } catch (err) {
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev : prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  const handlePostComment = async (text) => {
    try {
      await api.post(`/api/videos/${id}/comment`, { text });
      toast.success("Publié !");
    } catch (err) { toast.error("Erreur envoi"); }
  };

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm("Supprimer ce commentaire ?")) return;
    try {
        await api.delete(`/api/videos/${id}/comment/${commentId}`);
        toast.success("Supprimé");
    } catch (err) { toast.error("Erreur suppression"); }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
        await api.put(`/api/videos/${id}/comment/${commentId}`, { text: newText });
        toast.success("Modifié");
    } catch (err) { toast.error("Erreur modification"); }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="var(--color-gold)" size={32} /></div>;
  if (!video) return null;

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#FFF', paddingBottom: '40px', display: 'flex', flexDirection: 'column' }}>
      <VideoPlayer videoUrl={video.videoUrl} thumbnailUrl={video.thumbnailUrl} onPlay={handleViewTrigger} />
      <VideoInfo video={video} viewsCount={viewsCount} likesCount={likesCount} isLiked={isLiked} onLike={handleLike} onShare={handleShare} />
      <div style={{ padding: '0 20px' }}>
        <CommentsSection comments={video.comments} currentUser={user} onPostComment={handlePostComment} onDeleteComment={handleDeleteComment} onEditComment={handleEditComment} />
      </div>
    </div>
  );
};

export default Watch;