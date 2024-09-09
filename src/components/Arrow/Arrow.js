import React, { useEffect } from 'react';

const Arrow = ({ id, startX, startY, endX, endY, color = '#0077ff', zoom = 1, isSelected, onClick }) => {
  useEffect(() => {
    console.log(`Arrow rendered:`, { startX, startY, endX, endY, zoom });
  }, [startX, startY, endX, endY, zoom]);

  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const minX = Math.min(startX, endX);
  const minY = Math.min(startY, endY);
  const maxX = Math.max(startX, endX);
  const maxY = Math.max(startY, endY);
  const width = maxX - minX;
  const height = maxY - minY;

  const arrowHead = (
    <polygon
      points="-10,-5 0,0 -10,5"
      fill={color}
      transform={`translate(${endX - minX},${endY - minY}) rotate(${angle})`}
    />
  );

  const handleClick = (event) => {
    if (onClick) {
      onClick(event, id);
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'visible',
        pointerEvents: 'auto',
        cursor: 'pointer',
        zIndex: 1000,
      }}
      onClick={handleClick}
    >
      <line
        x1={startX - minX}
        y1={startY - minY}
        x2={endX - minX}
        y2={endY - minY}
        stroke={color}
        strokeWidth={isSelected ? 4 / zoom : 2 / zoom}
      />
      {arrowHead}
    </svg>
  );
};

export default Arrow;