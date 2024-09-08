import React, { useState, useCallback, useEffect } from 'react';
import Arrow from './Arrow';

const ArrowManager = ({ postits, arrowStart, setArrowStart, boardRef }) => {
  const [arrows, setArrows] = useState([]);
  const [tempArrow, setTempArrow] = useState(null);

  useEffect(() => {
    if (arrowStart) {
      const startPostit = postits.find(p => p.id === arrowStart.id);
      if (startPostit) {
        setTempArrow({
          startX: startPostit.x + (arrowStart.position === 'left' ? 0 : arrowStart.position === 'right' ? 200 : 100),
          startY: startPostit.y + (arrowStart.position === 'top' ? 0 : arrowStart.position === 'bottom' ? 150 : 75),
          endX: startPostit.x + 100,
          endY: startPostit.y + 75,
        });
      }
    } else {
      setTempArrow(null);
    }
  }, [arrowStart, postits]);

  const handleMouseMove = useCallback((event) => {
    if (tempArrow && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      setTempArrow(prev => ({
        ...prev,
        endX: event.clientX - rect.left,
        endY: event.clientY - rect.top,
      }));
    }
  }, [tempArrow, boardRef]);

  const handlePostitClick = useCallback((event, postitId) => {
    if (arrowStart && arrowStart.id !== postitId) {
      event.stopPropagation();
      const endPostit = postits.find(p => p.id === postitId);
      if (endPostit && tempArrow) {
        setArrows(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            startId: arrowStart.id,
            endId: postitId,
            startX: tempArrow.startX,
            startY: tempArrow.startY,
            endX: endPostit.x + 100,
            endY: endPostit.y + 75,
          },
        ]);
        setArrowStart(null);
      }
    }
  }, [arrowStart, postits, tempArrow, setArrowStart]);

  useEffect(() => {
    const board = boardRef.current;
    if (board) {
      board.addEventListener('mousemove', handleMouseMove);
      return () => {
        board.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [boardRef, handleMouseMove]);

  return (
    <>
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
      {postits.map(postit => (
        <div
          key={postit.id}
          style={{
            position: 'absolute',
            left: postit.x,
            top: postit.y,
            width: 200,
            height: 150,
            pointerEvents: arrowStart ? 'auto' : 'none',
          }}
          onClick={(e) => handlePostitClick(e, postit.id)}
        />
      ))}
    </>
  );
};

export default ArrowManager;