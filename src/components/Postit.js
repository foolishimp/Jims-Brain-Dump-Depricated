import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { parseMarkdown } from '../utils/postit';

const Postit = ({
  postit,
  updatePostit,
  zoom,
  isSelected,
  onSelect,
  onStartConnection,
  onPostitClick,
  isDrawingArrow
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredConnector, setHoveredConnector] = useState(null);

  useEffect(() => {
    console.log(`Postit ${postit.id} - isSelected: ${isSelected}, isDrawingArrow: ${isDrawingArrow}`);
  }, [postit.id, isSelected, isDrawingArrow]);

  const handleMouseDown = useCallback((event) => {
    console.log(`Postit ${postit.id} - MouseDown event`);
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
      console.log(`Postit ${postit.id} - Dragging`);
      updatePostit(postit.id, {
        x: event.clientX / zoom - dragOffset.x,
        y: event.clientY / zoom - dragOffset.y,
      });
    }
  }, [isDragging, dragOffset, postit.id, updatePostit, zoom]);

  const handleMouseUp = useCallback(() => {
    console.log(`Postit ${postit.id} - MouseUp event`);
    setIsDragging(false);
  }, [postit.id]);

  const handleClick = useCallback((event) => {
    console.log(`Postit ${postit.id} - Click event`);
    event.stopPropagation();
    onSelect(postit.id);
    onPostitClick(event, postit.id);
  }, [postit.id, onSelect, onPostitClick]);

  const handleDoubleClick = useCallback((event) => {
    console.log(`Postit ${postit.id} - DoubleClick event`);
    event.stopPropagation();
    updatePostit(postit.id, { isEditing: true });
  }, [postit.id, updatePostit]);

  const handleTextChange = useCallback((event) => {
    updatePostit(postit.id, { text: event.target.value });
  }, [postit.id, updatePostit]);

  const handleBlur = useCallback(() => {
    updatePostit(postit.id, { isEditing: false });
  }, [postit.id, updatePostit]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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
      style={{
        position: 'absolute',
        left: `${postit.x}px`,
        top: `${postit.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#ffff88',
        boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.5)' : '2px 2px 5px rgba(0,0,0,0.2)',
        padding: '10px',
        cursor: isDragging ? 'grabbing' : (isDrawingArrow ? 'default' : 'grab'),
        fontSize: `${fontSize}px`,
        border: isSelected ? '2px solid #0077ff' : 'none',
        pointerEvents: isDrawingArrow ? 'none' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
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
            left: `${point.x - 10}px`,
            top: `${point.y - 10}px`,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: hoveredConnector === index ? 'rgba(0, 119, 255, 0.8)' : 'rgba(0, 119, 255, 0.5)',
            cursor: 'crosshair',
            zIndex: 10,
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={() => setHoveredConnector(index)}
          onMouseLeave={() => setHoveredConnector(null)}
          onMouseDown={(e) => {
            e.stopPropagation();
            console.log(`Postit ${postit.id} - Connector clicked at ${point.position}`);
            onStartConnection(postit.id, point.position);
          }}
        />
      ))}
    </div>
  );
};

export default Postit;