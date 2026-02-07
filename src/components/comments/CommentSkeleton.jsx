// src/components/comments/CommentSkeleton.jsx
import React from 'react';

const shimmerKeyframes = `
@keyframes commentShimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
`;

const shimmerStyle = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,215,0,0.08) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '200px 100%',
  animation: 'commentShimmer 1.5s ease-in-out infinite',
  borderRadius: '8px'
};

const SkeletonLine = ({ width, height = '12px', style = {} }) => (
  <div style={{
    ...shimmerStyle,
    width,
    height,
    ...style
  }} />
);

const SingleCommentSkeleton = ({ delay = 0 }) => (
  <div style={{
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 215, 0, 0.05)',
    animationDelay: `${delay}ms`
  }}>
    {/* AVATAR SKELETON */}
    <div style={{
      ...shimmerStyle,
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      flexShrink: 0
    }} />

    {/* CONTENU SKELETON */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* LIGNE NOM + DATE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonLine width="35%" height="13px" />
        <SkeletonLine width="60px" height="11px" />
      </div>

      {/* LIGNES DE TEXTE */}
      <SkeletonLine width="90%" height="14px" />
      <SkeletonLine width="65%" height="14px" />
    </div>
  </div>
);

const CommentSkeleton = ({ count = 4 }) => (
  <>
    <style>{shimmerKeyframes}</style>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, index) => (
        <SingleCommentSkeleton key={index} delay={index * 150} />
      ))}
    </div>
  </>
);

export default CommentSkeleton;