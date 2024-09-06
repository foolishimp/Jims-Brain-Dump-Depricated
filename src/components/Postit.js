import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { parseMarkdown } from '../utils/postit';

const VERSION = "Postit v3";

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

  useEffect(() => {
    console.log(`${VERSION} - Component mounted for postit:`, postit.id);
  }, [postit.id]);

  useEffect(() => {
    console.log(`${VERSION} - Postit ${postit.id} - isSelected: ${isSelected}, isDrawingArrow: ${isDrawingArrow}`);
  }, [postit.id, isSelected, isDrawingArrow]);

  const handleMouseDown = useCallback((event) => {
    event.stopPropagation();
    console.log(`${VERSION} - Postit ${postit.id} - MouseDown, isDrawingArrow: ${isDrawingArrow}`);
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
    console.log(`${VERSION} - Postit ${postit.id} - MouseUp`);
    setIsDragging(false);
  }, [postit.id]);

  const handleDoubleClick = useCallback((event) => {
    event.stopPropagation();
    console.log(`${VERSION} - Postit ${postit.id} - DoubleClick`);
    updatePostit(postit.id, { isEditing: true });
  }, [postit.id, updatePostit]);

  const fontSize = useMemo(() => {
    if (zoom >= 1) return 16;
    if (zoom >= 0.5) return 14;
    if (zoom >= 0.25) return 12;
    if (zoom >= 0.1) return 10;
    return 8;
  }, [zoom]);

  const width = 200;
  const height = 150;

  const connectionPoints = [
    { x: width / 2, y: 0, position: 'top' },
    { x: width, y: height / 2, position: 'right' },
    { x: width / 2, y: height, position: 'bottom' },
    { x: 0, y: height / 2, position: 'left' },
  ];

  return (
    <div
      className="postit"
      style={{
        position: 'absolute',
        left: `${postit.x}px`,
        top: `${postit.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#ffff88',
        boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.5)' : '2px 2px 5px rgba(0,0,0,0.2)',
        padding: '10px',
        cursor: isDragging ? 'grabbing' : (isDrawingArrow ? 'crosshair' : 'grab'),
        fontSize: `${fontSize}px`,
        border: isSelected ? '2px solid #0077ff' : 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {postit.isEditing ? (
        <textarea
          value={postit.text}
          onChange={(e) => updatePostit(postit.id, { text: e.target.value })}
          onBlur={() => updatePostit(postit.id, { isEditing: false })}
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
        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(postit.text) }} />
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
            console.log(`${VERSION} - Postit ${postit.id} - Connection point clicked, position: ${point.position}`);
            onStartConnection(postit.id, point.position);
          }}
        />
      ))}
    </div>
  );
};

export default Postit;