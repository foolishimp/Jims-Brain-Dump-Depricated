import React, { useState, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import Arrow from './Arrow/Arrow';

const ArrowManager = forwardRef(({ 
  postits, 
  arrows, 
  arrowStart, 
  setArrowStart, 
  boardRef, 
  zoom, 
  position, 
  selectedArrow,
  onArrowClick,
  onCreateArrow 
}, ref) => {
  const [tempArrow, setTempArrow] = useState(null);

  const getPostitConnectionPoints = useCallback((postit) => {
    if (!postit || typeof postit.x !== 'number' || typeof postit.y !== 'number') {
      console.error('Invalid postit:', postit);
      return [];
    }
    const width = 200;
    const height = 150;
    return [
      { x: postit.x + width / 2, y: postit.y, position: 'top' },
      { x: postit.x + width, y: postit.y + height / 2, position: 'right' },
      { x: postit.x + width / 2, y: postit.y + height, position: 'bottom' },
      { x: postit.x, y: postit.y + height / 2, position: 'left' },
    ];
  }, []);

  const getClosestConnectionPoint = useCallback((postit, x, y) => {
    const points = getPostitConnectionPoints(postit);
    if (points.length === 0) return null;
    return points.reduce((closest, point) => {
      const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      return distance < closest.distance ? { ...point, distance } : closest;
    }, { distance: Infinity });
  }, [getPostitConnectionPoints]);

  const handleMouseMove = useCallback((event) => {
    if (arrowStart && boardRef.current) {
      const startPostit = postits.find(p => p.id === arrowStart.id);
      if (startPostit) {
        const rect = boardRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left - (position?.x || 0)) / zoom;
        const y = (event.clientY - rect.top - (position?.y || 0)) / zoom;
        const startPoint = getClosestConnectionPoint(startPostit, x, y);
        if (startPoint) {
          setTempArrow({
            startX: startPoint.x,
            startY: startPoint.y,
            endX: x,
            endY: y,
          });
        }
      }
    }
  }, [arrowStart, postits, boardRef, zoom, position, getClosestConnectionPoint]);

  useEffect(() => {
    const board = boardRef.current;
    if (board) {
      board.addEventListener('mousemove', handleMouseMove);
      return () => {
        board.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [boardRef, handleMouseMove]);

  const handlePostitClick = useCallback((event, postitId) => {
    if (arrowStart && arrowStart.id !== postitId) {
      event.stopPropagation();
      const startPostit = postits.find(p => p.id === arrowStart.id);
      const endPostit = postits.find(p => p.id === postitId);
      if (startPostit && endPostit && boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left - (position?.x || 0)) / zoom;
        const y = (event.clientY - rect.top - (position?.y || 0)) / zoom;
        const startPoint = getClosestConnectionPoint(startPostit, x, y);
        const endPoint = getClosestConnectionPoint(endPostit, x, y);
        if (startPoint && endPoint) {
          const newArrow = {
            id: Date.now().toString(),
            startId: arrowStart.id,
            endId: postitId,
            startPosition: startPoint.position,
            endPosition: endPoint.position,
          };
          onCreateArrow(newArrow);
          setArrowStart(null);
          setTempArrow(null);
        }
      }
    }
  }, [arrowStart, postits, boardRef, zoom, position, getClosestConnectionPoint, setArrowStart, onCreateArrow]);

  const handleArrowClick = useCallback((event, arrowId) => {
    event.stopPropagation();
    onArrowClick(event, arrowId);
  }, [onArrowClick]);

  useImperativeHandle(ref, () => ({
    handlePostitClick
  }));

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {arrows.map(arrow => {
        const startPostit = postits.find(p => p.id === arrow.startId);
        const endPostit = postits.find(p => p.id === arrow.endId);
        if (startPostit && endPostit) {
          const startPoint = getClosestConnectionPoint(startPostit, endPostit.x, endPostit.y);
          const endPoint = getClosestConnectionPoint(endPostit, startPostit.x, startPostit.y);
          if (startPoint && endPoint) {
            return (
              <Arrow
                key={arrow.id}
                id={arrow.id}
                startX={startPoint.x}
                startY={startPoint.y}
                endX={endPoint.x}
                endY={endPoint.y}
                zoom={zoom}
                isSelected={selectedArrow === arrow.id}
                onClick={handleArrowClick}
              />
            );
          }
        }
        return null;
      })}
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