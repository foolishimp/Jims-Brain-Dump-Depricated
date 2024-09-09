import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const PostitContainer = ({
  postit,
  updatePostit,
  zoom,
  isSelected,
  isDrawingArrow,
  onClick,
  onContextMenu,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((event) => {
    if (!isDrawingArrow) {
      event.stopPropagation(); // Prevent the event from bubbling up to the InfiniteCanvas
      setIsDragging(true);
      setDragOffset({
        x: event.clientX / zoom - postit.x,
        y: event.clientY / zoom - postit.y,
      });
    }
  }, [isDrawingArrow, zoom, postit.x, postit.y]);

  const handleMouseMove = useCallback((event) => {
    if (isDragging) {
      event.stopPropagation(); // Prevent the event from bubbling up to the InfiniteCanvas
      updatePostit({
        x: event.clientX / zoom - dragOffset.x,
        y: event.clientY / zoom - dragOffset.y,
      });
    }
  }, [isDragging, updatePostit, zoom, dragOffset]);

  const handleMouseUp = useCallback((event) => {
    if (isDragging) {
      event.stopPropagation(); // Prevent the event from bubbling up to the InfiniteCanvas
    }
    setIsDragging(false);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: `${postit.x}px`,
        top: `${postit.y}px`,
        width: '200px',
        height: '150px',
        backgroundColor: postit.color || '#ffff88',
        boxShadow: isSelected ? '0 0 10px rgba(0,0,0,0.5)' : '2px 2px 5px rgba(0,0,0,0.2)',
        padding: '10px',
        cursor: isDragging ? 'grabbing' : (isDrawingArrow ? 'crosshair' : 'grab'),
        fontSize: `${zoom >= 1 ? 16 : zoom >= 0.5 ? 14 : zoom >= 0.25 ? 12 : zoom >= 0.1 ? 10 : 8}px`,
        border: isSelected ? '2px solid #0077ff' : 'none',
        pointerEvents: 'auto',
        zIndex: isSelected ? 10 : 1,
        transition: 'box-shadow 0.3s ease, border 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {children}
    </div>
  );
};

PostitContainer.propTypes = {
  postit: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    color: PropTypes.string,
  }).isRequired,
  updatePostit: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDrawingArrow: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default React.memo(PostitContainer);