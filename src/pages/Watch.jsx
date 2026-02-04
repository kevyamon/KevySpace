import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// ON IMPORTE NOS BRIQUES
import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import CommentsSection from '../components/CommentsSection';

const Watch = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  // -- ÉTATS DONNÉES --
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // -- ÉTATS PARTAGÉS (Likes/Vues sont ici car liés à l'API du parent) --
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  // CHARGEMENT
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const res = await api.get(`/api/videos/${id}`);
        const data = res.data.data || res.data;
        
        setVideo(data);
        setLikesCount(data.likes ? data.likes.length : 0);
        setViewsCount(data.views || 0);
        
        if (user && data.likes) {
          setIsLiked(data.likes.includes(user._id));
        }

      } catch (err) {
        toast.error("Impossible de charger la vidéo");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchVideoDetails();
  }, [id, user]);

  // TEMPS RÉEL
  useEffect(() => {
    const interval = setInterval(() => {
      setViewsCount(prev => prev + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // -- HANDLERS API --
  const handleLike = async () => {
    const previousLiked = isLiked;
    setIsLiked(!isLiked);
    setLikesCount(prev => !previousLiked ? prev + 1 : prev - 1);

    try {
      const res = await api.put(`/api/videos/${id}/like`);
      const updatedLikes = res.data.data;
      setLikesCount(updatedLikes.length);
      setIsLiked(updatedLikes.includes(user._id));
    } catch (err) {
      setIsLiked(previousLiked);
      setLikesCount(prev => previousLiked ? prev + 1 : prev - 1);
      toast.error("Erreur connexion");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !");
  };

  const handlePostComment = async (text) => {
    try {
      const res = await api.post(`/api/videos/${id}/comment`, { text });
      setVideo(prev => ({ ...prev, comments: res.data.data }));
      toast.success("Publié !");
    } catch (err) {
      toast.error("Erreur envoi");
    }
  };

  // Simulations en attendant routes DELETE/PUT
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
    // STRUCTURE SOUPLE (Pas de height: 100vh) -> La page scrolle naturellement
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

      {/* 2. INFOS */}
      <VideoInfo 
        video={video}
        viewsCount={viewsCount}
        likesCount={likesCount}
        isLiked={isLiked}
        onLike={handleLike}
        onShare={handleShare}
      />

      {/* 3. COMMENTAIRES (Container simple, le scroll interne est géré dans le composant) */}
      <div style={{ padding: '0 20px' }}>
        <CommentsSection 
          comments={video.comments}
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