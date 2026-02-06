// src/components/VideoPlayer.jsx
import React, { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoPlayer = ({ videoUrl, thumbnailUrl, onPlay }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.log(`Erreur en essayant d'activer le plein écran: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleVideoClick = (e) => {
    // Empêcher la propagation pour éviter de déclencher d'autres événements
    e.stopPropagation();
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        aspectRatio: '16/9', 
        backgroundColor: '#000', 
        position: 'relative',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}
    >
      {/* HEADER FLOTTANT */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 50 
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'rgba(255,255,255,0.8)', 
            backdropFilter: 'blur(10px)',
            border: 'none', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <ArrowLeft size={20} color="#1D1D1F" />
        </button>
      </div>

      {/* VIDÉO */}
      <video 
        ref={videoRef}
        src={videoUrl} 
        controls 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          display: 'block'
        }}
        poster={thumbnailUrl}
        onPlay={onPlay}
        onClick={handleVideoClick}
        onDoubleClick={handleFullscreen}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;