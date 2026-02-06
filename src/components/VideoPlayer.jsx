// src/components/VideoPlayer.jsx
import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoPlayer = ({ videoUrl, thumbnailUrl, onPlay }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      width: '100%', 
      aspectRatio: '16/9', 
      backgroundColor: '#000', 
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* HEADER FLOTTANT */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50 }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: '50%', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <ArrowLeft size={20} color="#1D1D1F" />
        </button>
      </div>

      {/* FIX FULLSCREEN: 
          1. playsInline : Stabilise la transition sur mobile
          2. Memoization (export) : Empêche le re-render au resize
      */}
      <video 
        src={videoUrl} 
        controls 
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        poster={thumbnailUrl}
        onPlay={onPlay}
      />
    </div>
  );
};

// VACCIN : React.memo empêche le rechargement de la vidéo quand le parent re-render (ex: changement de taille d'écran)
export default memo(VideoPlayer);