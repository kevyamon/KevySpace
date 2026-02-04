// src/pages/Watch.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Tes composants modulaires (ne changent pas)
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
  
  // Ces états servent à l'affichage instantané, mais sont synchronisés avec le backend
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  // 1. CHARGEMENT & INCREMENTATION VUE
  useEffect(() => {
    let isMounted = true;

    const initPage = async () => {
      try {
        // A. On incrémente la vue CÔTÉ SERVEUR (+1 en DB)
        // C'est ça qui manquait !
        await api.put(`/api/videos/${id}/view`);

        // B. On récupère les données FRAÎCHES (incluant la nouvelle vue et les vrais likes)
        const res = await api.get(`/api/videos/${id}`);
        const data = res.data.data || res.data;
        
        if (isMounted) {
          setVideo(data);
          
          // On initialise l'affichage avec les VRAIES valeurs de la DB
          setViewsCount(data.views || 0);
          setLikesCount(data.likes ? data.likes.length : 0);
          
          if (user && data.likes) {
            setIsLiked(data.likes.includes(user._id));
          }
        }
      } catch (err) {
        console.error("Erreur init", err);
        // Si l'incrémentation vue échoue, on essaie quand même de charger la vidéo
        try {
            const resFallback = await api.get(`/api/videos/${id}`);
            if (isMounted) {
                const data = resFallback.data.data;
                setVideo(data);
                setViewsCount(data.views || 0);
                setLikesCount(data.likes ? data.likes.length : 0);
            }
        } catch (e) {
            toast.error("Impossible de charger la vidéo");
            navigate('/');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (user) initPage();

    return () => { isMounted = false; };
  }, [id, user, navigate]);

  // -- HANDLERS (Connectés au Backend) --

  const handleLike = async () => {
    // 1. Optimistic UI (On change l'interface tout de suite)
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(prev => !previousLiked ? prev + 1 : prev - 1);

    try {
      // 2. On envoie la requête au Backend qui va sauvegarder en DB
      const res = await api.put(`/api/videos/${id}/like`);
      
      // 3. On synchronise avec la réponse officielle du Backend
      const updatedLikes = res.data.data; // Le tableau d'IDs mis à jour
      setLikesCount(updatedLikes.length);
      setIsLiked(updatedLikes.includes(user._id));
      
    } catch (err) {
      // 4. Si ça plante, on annule
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Erreur lors du like");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  const handlePostComment = async (text) => {
    try {
      const res = await api.post(`/api/videos/${id}/comment`, { text });
      // Le backend renvoie le tableau complet des commentaires à jour
      setVideo(prev => ({ ...prev, comments: res.data.data }));
      toast.success("Publié !");
    } catch (err) {
      toast.error("Erreur envoi");
    }
  };

  // Actions Simulées (En attendant les routes DELETE/PUT backend pour commentaires)
  const handleDeleteComment = (commentId) => {
    if(window.confirm("Supprimer ce commentaire (Simulation) ?")) {
      setVideo(prev => ({ ...prev, comments: prev.comments.filter(c => c._id !== commentId) }));
      toast.success("Supprimé");
    }
  };

  const handleEditComment = (commentId, newText) => {
    setVideo(prev => ({ ...prev, comments: prev.comments.map(c => c._id === commentId ? { ...c, text: newText } : c) }));
    toast.success("Modifié");
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
      
      {/* 1. LECTEUR */}
      <VideoPlayer 
        videoUrl={video.videoUrl} 
        thumbnailUrl={video.thumbnailUrl} 
      />

      {/* 2. INFOS (Avec les compteurs réels) */}
      <VideoInfo 
        video={video}
        viewsCount={viewsCount} // Vient du state sync avec DB
        likesCount={likesCount} // Vient du state sync avec DB
        isLiked={isLiked}       // Vient du state sync avec DB
        onLike={handleLike}
        onShare={handleShare}
      />

      {/* 3. COMMENTAIRES (Liste réelle) */}
      <div style={{ padding: '0 20px' }}>
        <CommentsSection 
          comments={video.comments} // Vient de la DB
          currentUser={user}
          onPostComment={handlePostComment}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
        />
      </div>
      
    </div>
  );
};

export default Watch;