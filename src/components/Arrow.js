import React, { useEffect } from 'react';

const VERSION = "Arrow v4.1";

const Arrow = ({ startX, startY, endX, endY, color = '#0077ff', zoom = 1 }) => {
  useEffect(() => {
    console.log(`${VERSION} - Arrow rendered:`, { startX, startY, endX, endY, zoom });
  }, [startX, startY, endX, endY, zoom]);

  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const arrowHead = (
    <polygon
      points="-10,-5 0,0 -10,5"
      fill={color}
      transform={`translate(${endX},${endY}) rotate(${angle}) scale(${1/zoom})`}
    />
  );

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={2 / zoom}
      />
      {arrowHead}
    </svg>
  );
};

export default Arrow;