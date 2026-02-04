import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, Eye, Calendar } from 'lucide-react';

const VideoInfo = ({ video, viewsCount, likesCount, isLiked, onLike, onShare }) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1.3', marginBottom: '8px' }}>
        {video?.title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#86868B', marginBottom: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Eye size={14} /> {viewsCount.toLocaleString()} vues
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isLiked ? '#FF3B30' : '#86868B', fontWeight: isLiked ? '700' : '400' }}>
          <Heart size={14} fill={isLiked ? "#FF3B30" : "none"} /> {likesCount} likes
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} /> {new Date(video?.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* BARRE D'ACTIONS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <ActionButton 
          icon={<Heart size={20} fill={isLiked ? "#FF3B30" : "none"} color={isLiked ? "#FF3B30" : "#1D1D1F"} />} 
          label={isLiked ? "Aimé" : "J'aime"} 
          onClick={onLike} 
          active={isLiked} 
        />
        <ActionButton icon={<Share2 size={20} />} label="Partager" onClick={onShare} />
        <ActionButton icon={<MessageCircle size={20} />} label={`${video?.comments?.length || 0}`} onClick={() => {}} />
      </div>

      {/* DESCRIPTION INTELLIGENTE */}
      <div style={{ 
        backgroundColor: '#F2F2F7', borderRadius: '16px', padding: '16px',
        marginBottom: '32px',
        maxHeight: isDescExpanded ? '250px' : 'auto', 
        overflowY: isDescExpanded ? 'auto' : 'hidden',
        transition: 'all 0.3s'
      }}>
        <p style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>Description</p>
        <div style={{ 
          fontSize: '14px', lineHeight: '1.5', color: '#1D1D1F',
          display: isDescExpanded ? 'block' : '-webkit-box',
          WebkitLineClamp: isDescExpanded ? 'none' : 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video?.description || "Aucune description."}
        </div>
        <button 
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          style={{ 
            background: 'none', border: 'none', 
            fontSize: '12px', fontWeight: '700', color: '#555',
            marginTop: '8px', cursor: 'pointer', padding: 0
          }}
        >
          {isDescExpanded ? "▲ Réduire" : "▼ Tout afficher"}
        </button>
      </div>
    </div>
  );
};

// Bouton interne
const ActionButton = ({ icon, label, onClick, active }) => (
  <button onClick={onClick} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '18px', border: 'none', backgroundColor: active ? '#FFF0F0' : '#F5F5F7', color: active ? '#FF3B30' : '#1D1D1F', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
    {icon} {label}
  </button>
);

export default VideoInfo;