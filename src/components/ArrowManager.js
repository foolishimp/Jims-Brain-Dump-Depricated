import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import Arrow from './Arrow';
import { useArrowDrawing } from '../hooks/useArrowDrawing';

const ArrowManager = forwardRef(({ postits, arrowStart, setArrowStart, boardRef, zoom, position }, ref) => {
  const [arrows, setArrows] = useState([]);

  const getPostitConnectionPoint = useCallback((postit, position) => {
    switch (position) {
      case 'left': return { x: postit.x, y: postit.y + 75 };
      case 'right': return { x: postit.x + 200, y: postit.y + 75 };
      case 'top': return { x: postit.x + 100, y: postit.y };
      case 'bottom': return { x: postit.x + 100, y: postit.y + 150 };
      default: return { x: postit.x + 100, y: postit.y + 75 };
    }
  }, []);

  const tempArrow = useArrowDrawing(boardRef, zoom, position, arrowStart, postits, getPostitConnectionPoint);

  const handlePostitClick = useCallback((event, postitId) => {
    if (arrowStart && arrowStart.id !== postitId) {
      event.stopPropagation();
      const endPostit = postits.find(p => p.id === postitId);
      if (endPostit && tempArrow) {
        const endPoint = getPostitConnectionPoint(endPostit, 'center');
        const newArrow = {
          id: Date.now().toString(),
          startId: arrowStart.id,
          endId: postitId,
          startX: tempArrow.startX,
          startY: tempArrow.startY,
          endX: endPoint.x,
          endY: endPoint.y,
        };
        setArrows(prev => [...prev, newArrow]);
        setArrowStart(null);
      }
    }
  }, [arrowStart, postits, tempArrow, setArrowStart, getPostitConnectionPoint]);

  useImperativeHandle(ref, () => ({
    handlePostitClick
  }));

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {arrows.map(arrow => (
        <Arrow
          key={arrow.id}
          startX={arrow.startX}
          startY={arrow.startY}
          endX={arrow.endX}
          endY={arrow.endY}
          zoom={zoom}
        />
      ))}
      {tempArrow && (
        <Arrow
          startX={tempArrow.startX}
          startY={tempArrow.startY}
          endX={tempArrow.endX}
          endY={tempArrow.endY}
          zoom={zoom}
          color="#ff0000"
        />
      )}
    </div>
  );
});

export default ArrowManager;