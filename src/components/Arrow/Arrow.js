import React, { useEffect } from 'react';

const VERSION = "Arrow v4.5";

const Arrow = ({ startX, startY, endX, endY, color = '#0077ff', zoom = 1 }) => {
  useEffect(() => {
    console.log(`${VERSION} - Arrow rendered:`, { startX, startY, endX, endY, zoom });
  }, [startX, startY, endX, endY, zoom]);

  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  // Calculate the bounding box for the arrow
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

  return (
    <svg
      style={{
        position: 'absolute',
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <line
        x1={startX - minX}
        y1={startY - minY}
        x2={endX - minX}
        y2={endY - minY}
        stroke={color}
        strokeWidth={2 / zoom}
      />
      {arrowHead}
    </svg>
  );
};

export default Arrow;