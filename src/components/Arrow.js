import React, { useEffect } from 'react';

const VERSION = "Arrow v2";

const Arrow = ({ startX, startY, endX, endY, color = '#0077ff' }) => {
  useEffect(() => {
    console.log(`${VERSION} - Arrow rendered:`, { startX, startY, endX, endY });
  }, [startX, startY, endX, endY]);

  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${length}px`,
        height: '2px',
        backgroundColor: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '-8px',
          top: '-4px',
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: `8px solid ${color}`,
        }}
      />
    </div>
  );
};

export default Arrow;