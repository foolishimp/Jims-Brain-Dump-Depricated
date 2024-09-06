import React from 'react';

const ConnectionPoint = ({ x, y, onStartConnection }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x - 5}px`,
        top: `${y - 5}px`,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#0077ff',
        cursor: 'pointer',
        zIndex: 10,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onStartConnection();
      }}
    />
  );
};

export default ConnectionPoint;