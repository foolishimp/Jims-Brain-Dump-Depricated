import React, { useState, useCallback, useMemo } from 'react';
import { parseMarkdown } from '../utils/postit';

const Postit = ({
  postit,
  updatePostit,
  zoom,
  isSelected,
  onSelect,
  onStartConnection,
  isDrawingArrow
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event) => {
    event.stopPropagation();
    if (!isDrawingArrow) {
      onSelect(postit.id);
      setIsDragging(true);
      setDragOffset({
        x: event.clientX / zoom - postit.x,
        y: event.clientY / zoom - postit.y,
      });
    }
  }, [postit.id, postit.x, postit.y, zoom, onSelect, isDrawingArrow]);

  const handleMouseMove = useCallback((event) => {
    if (isDragging) {
      updatePostit(postit.id, {
        x: event.clientX / zoom - dragOffset.x,
        y: event.clientY / zoom - dragOffset.y,
      });
    }
  }, [isDragging, dragOffset, postit.id, updatePostit, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback((event) => {
    event.stopPropagation();
    updatePostit(postit.id, { isEditing: true });
  }, [postit.id, updatePostit]);

  const handleTextChange = useCallback((event) => {
    updatePostit(postit.id, { text: event.target.value });
  }, [postit.id, updatePostit]);

  const handleBlur = useCallback(() => {
    updatePostit(postit.id, { isEditing: false });
  }, [postit.id, updatePostit]);

  const fontSize = useMemo(() => {
    const baseFontSize = 16;
    return Math.max(baseFontSize * zoom, 8); // Ensure minimum font size of 8px
  }, [zoom]);

  const width = 200 * zoom;
  const height = 150 * zoom;

  const connectionPoints = [
    { x: width / 2, y: 0, position: 'top' },
    { x: width, y: height / 2, position: 'right' },
    { x: width / 2, y: height, position: 'bottom' },
    { x: 0, y: height / 2, position: 'left' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: `${postit.x}px`,
        top: `${postit.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#ffff88',
        boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.5)' : '2px 2px 5px rgba(0,0,0,0.2)',
        padding: `${10 * zoom}px`,
        cursor: isDragging ? 'grabbing' : (isDrawingArrow ? 'default' : 'grab'),
        fontSize: `${fontSize}px`,
        border: isSelected ? `${2 * zoom}px solid #0077ff` : 'none',
        pointerEvents: isDrawingArrow ? 'none' : 'auto',
        transform: `scale(${1 / zoom})`,
        transformOrigin: 'top left',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {postit.isEditing ? (
        <textarea
          value={postit.text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            resize: 'none',
            backgroundColor: 'transparent',
            fontSize: 'inherit',
          }}
          autoFocus
        />
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: parseMarkdown(postit.text) }}
        />
      )}
      {isSelected && !isDrawingArrow && connectionPoints.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${point.x - 5}px`,
            top: `${point.y - 5}px`,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#0077ff',
            cursor: 'pointer',
            zIndex: 10,
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnection(postit.id, point.position);
          }}
        />
      ))}
    </div>
  );
};

export default Postit;