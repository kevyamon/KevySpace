// src/components/VideoPlayer.jsx
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoPlayer = ({ videoUrl, thumbnailUrl, onPlay }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Initialisation de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
    };

    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement || 
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement ||
                               document.msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
    };

    videoElement.addEventListener('canplay', handleCanPlay);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!isVideoReady) return;

    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        // Entrer en plein écran
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        // Quitter le plein écran
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Erreur lors du changement de mode plein écran:', error);
    }
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
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* HEADER FLOTTANT */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 50,
        display: 'flex',
        gap: '10px'
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ArrowLeft size={20} color="#1D1D1F" />
        </button>

        {/* BOUTON PLEIN ÉCRAN PERSONNALISÉ */}
        <button 
          onClick={toggleFullscreen}
          disabled={!isVideoReady}
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
            cursor: isVideoReady ? 'pointer' : 'not-allowed',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            opacity: isVideoReady ? 1 : 0.5,
            transition: 'transform 0.2s ease, opacity 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (isVideoReady) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            if (isVideoReady) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {isFullscreen ? (
            <Minimize2 size={20} color="#1D1D1F" />
          ) : (
            <Maximize2 size={20} color="#1D1D1F" />
          )}
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
        playsInline
        preload="metadata"
      />
    </div>
  );
};

export default VideoPlayer;