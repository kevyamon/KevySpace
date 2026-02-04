// src/pages/Watch.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Composants
import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import CommentsSection from '../components/CommentsSection';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // -- ÉTATS --
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // États d'interface
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  // Ref pour éviter le double comptage de vue dans la même session
  const hasViewedRef = useRef(false);

  // 1. CHARGEMENT INITIAL (SANS COMPTER LA VUE)
  useEffect(() => {
    let isMounted = true;
    // Reset du flag de vue quand on change de vidéo
    hasViewedRef.current = false; 

    const fetchVideo = async () => {
      try {
        const res = await api.get(`/api/videos/${id}`);
        const data = res.data.data || res.data;
        
        if (isMounted) {
          setVideo(data);
          setViewsCount(data.views || 0);
          setLikesCount(data.likes ? data.likes.length : 0);
          
          if (user && data.likes) {
            setIsLiked(data.likes.includes(user._id));
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur chargement", err);
        toast.error("Impossible de charger la vidéo");
        navigate('/');
      }
    };

    if (user) fetchVideo();

    return () => { isMounted = false; };
  }, [id, user, navigate]);

  // -- HANDLERS --

  // A. GESTION DES VUES (1 Clic Play = 1 Vue)
  const handleViewTrigger = async () => {
    if (hasViewedRef.current) return; // Déjà compté pour cette session
    
    try {
        hasViewedRef.current = true; // On verrouille immédiatement
        // On envoie la requête
        const res = await api.put(`/api/videos/${id}/view`);
        // On met à jour l'affichage avec la vraie valeur retournée par le serveur
        if(res.data.data) {
             setViewsCount(res.data.data.views);
        }
    } catch (err) {
        console.error("Erreur compteur vue", err);
    }
  };

  // B. GESTION DES LIKES (Stabilisée)
  const handleLike = async () => {
    // Optimistic UI : On change l'état visuel tout de suite pour la réactivité
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const res = await api.put(`/api/videos/${id}/like`);
      // VÉRITÉ ABSOLUE : On écrase nos valeurs avec celles du serveur
      // Le serveur renvoie le tableau des likes mis à jour
      const updatedLikesList = res.data.data;
      setLikesCount(updatedLikesList.length);
      setIsLiked(updatedLikesList.includes(user._id));
    } catch (err) {
      // Si erreur, on remet comme avant
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev : prev - 1); // Correction simple
      toast.error("Erreur lors du like");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  // C. COMMENTAIRES (Vrai CRUD)
  const handlePostComment = async (text) => {
    try {
      const res = await api.post(`/api/videos/${id}/comment`, { text });
      setVideo(prev => ({ ...prev, comments: res.data.data }));
      toast.success("Publié !");
    } catch (err) {
      toast.error("Erreur envoi");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if(!window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) return;
    try {
        const res = await api.delete(`/api/videos/${id}/comment/${commentId}`);
        setVideo(prev => ({ ...prev, comments: res.data.data }));
        toast.success("Supprimé");
    } catch (err) {
        toast.error("Impossible de supprimer");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
        const res = await api.put(`/api/videos/${id}/comment/${commentId}`, { text: newText });
        setVideo(prev => ({ ...prev, comments: res.data.data }));
        toast.success("Modifié");
    } catch (err) {
        toast.error("Impossible de modifier");
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="var(--color-gold)" size={32} /></div>;
  if (!video) return null;

  return (
    <div style={{ 
      minHeight: '100%', 
      backgroundColor: '#FFF', 
      paddingBottom: '40px',
      display: 'flex', flexDirection: 'column'
    }}>
      
      {/* 1. LECTEUR (Avec Trigger Vue) */}
      <VideoPlayer 
        videoUrl={video.videoUrl} 
        thumbnailUrl={video.thumbnailUrl}
        onPlay={handleViewTrigger} // <--- C'est ici qu'on branche le compteur
      />

      {/* 2. INFOS */}
      <VideoInfo 
        video={video}
        viewsCount={viewsCount} 
        likesCount={likesCount} 
        isLiked={isLiked}       
        onLike={handleLike}
        onShare={handleShare}
      />

      {/* 3. COMMENTAIRES (Connectés) */}
      <div style={{ padding: '0 20px' }}>
        <CommentsSection 
          comments={video.comments} 
          currentUser={user}
          onPostComment={handlePostComment}
          onDeleteComment={handleDeleteComment} // Vraie fonction
          onEditComment={handleEditComment}     // Vraie fonction
        />
      </div>
      
    </div>
  );
};

export default Watch;