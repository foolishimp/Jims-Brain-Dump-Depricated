import React, { useState, useCallback, useEffect, useRef } from 'react';
import Arrow from './Arrow';

const VERSION = "ArrowManager v2";

const ArrowManager = ({ postits, arrowDragMode, onEndConnection, arrows }) => {
  const [tempArrow, setTempArrow] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log(`${VERSION} - Component mounted`);
  }, []);

  useEffect(() => {
    console.log(`${VERSION} - ArrowDragMode changed:`, arrowDragMode);
    if (arrowDragMode) {
      const startPostit = postits.find(p => p.id === arrowDragMode.startId);
      if (startPostit) {
        const startX = startPostit.x + (arrowDragMode.startPosition === 'left' ? 0 : arrowDragMode.startPosition === 'right' ? 200 : 100);
        const startY = startPostit.y + (arrowDragMode.startPosition === 'top' ? 0 : arrowDragMode.startPosition === 'bottom' ? 150 : 75);
        setTempArrow({
          startX,
          startY,
          endX: startX,
          endY: startY,
        });
        console.log(`${VERSION} - Temporary arrow set:`, { startX, startY });
      }
    } else {
      setTempArrow(null);
      console.log(`${VERSION} - Temporary arrow cleared`);
    }
  }, [arrowDragMode, postits]);

  const handleMouseMove = useCallback((event) => {
    if (arrowDragMode && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;
      setTempArrow(prev => ({
        ...prev,
        endX,
        endY,
      }));
      console.log(`${VERSION} - Temporary arrow updated:`, { endX, endY });
    }
  }, [arrowDragMode]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  console.log(`${VERSION} - Rendering, arrows:`, arrows, 'tempArrow:', tempArrow);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        pointerEvents: 'none',
      }}
    >
      {arrows.map(arrow => (
        <Arrow
          key={arrow.id}
          startX={arrow.startX}
          startY={arrow.startY}
          endX={arrow.endX}
          endY={arrow.endY}
        />
      ))}
      {tempArrow && (
        <Arrow
          startX={tempArrow.startX}
          startY={tempArrow.startY}
          endX={tempArrow.endX}
          endY={tempArrow.endY}
        />
      )}
    </div>
  );
};

export default ArrowManager;