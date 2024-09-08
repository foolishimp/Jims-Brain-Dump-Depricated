import { useState, useCallback, useEffect } from 'react';

export const useArrowDrawing = (boardRef, zoom, arrowStart, postits, getPostitConnectionPoint) => {
  const [tempArrow, setTempArrow] = useState(null);

  useEffect(() => {
    if (arrowStart) {
      const startPostit = postits.find(p => p.id === arrowStart.id);
      if (startPostit) {
        const startPoint = getPostitConnectionPoint(startPostit, arrowStart.position);
        setTempArrow({
          startX: startPoint.x,
          startY: startPoint.y,
          endX: startPoint.x,
          endY: startPoint.y,
        });
      }
    } else {
      setTempArrow(null);
    }
  }, [arrowStart, postits, getPostitConnectionPoint]);

  // Handle mouse movement for dynamic arrow rendering
  const handleMouseMove = useCallback((event) => {
    if (tempArrow && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / zoom;  // Adjust X position based on zoom level
      const y = (event.clientY - rect.top) / zoom;   // Adjust Y position based on zoom level
      setTempArrow(prev => ({
        ...prev,
        endX: x,
        endY: y,
      }));
    }
  }, [tempArrow, boardRef, zoom]);

  // Attach the event listener
  useEffect(() => {
    const board = boardRef.current;
    if (board) {
      board.addEventListener('mousemove', handleMouseMove);
      return () => {
        board.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [boardRef, handleMouseMove]);

  return tempArrow;
};
