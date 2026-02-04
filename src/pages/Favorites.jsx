import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import VideoCard from '../components/VideoCard';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/videos').then(res => {
      // Filtrage côté client simple pour l'instant
      const favs = res.data.data.filter(v => v.likes.includes(user._id));
      setVideos(favs);
    });
  }, [user]);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Mes Favoris</h1>
      {videos.length === 0 ? <p style={{color:'#888'}}>Aucun favori pour le moment.</p> : (
        <div>{videos.map(v => <VideoCard key={v._id} video={v} onClick={() => navigate(`/watch/${v._id}`)} />)}</div>
      )}
    </div>
  );
};
export default Favorites;