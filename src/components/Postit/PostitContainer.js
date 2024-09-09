import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import useDraggable from '../../hooks/useDraggable';

const PostitContainer = ({
  postit,
  updatePostit,
  zoom,
  isSelected,
  isDrawingArrow,
  onClick,
  onDoubleClick,
  onContextMenu,
  children
}) => {
  const containerRef = useRef(null);

  const handlePositionChange = useCallback((newPosition) => {
    updatePostit({ x: newPosition.x, y: newPosition.y });
  }, [updatePostit]);

  const { handleMouseDown } = useDraggable(
    { x: postit.x, y: postit.y },
    handlePositionChange,
    zoom
  );

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
        cursor: isDrawingArrow ? 'crosshair' : (postit.isEditing ? 'text' : 'grab'),
        fontSize: `${zoom >= 1 ? 16 : zoom >= 0.5 ? 14 : zoom >= 0.25 ? 12 : zoom >= 0.1 ? 10 : 8}px`,
        border: isSelected ? '2px solid #0077ff' : 'none',
        pointerEvents: 'auto',
        zIndex: isSelected ? 10 : 1,
        transition: 'box-shadow 0.3s ease, border 0.3s ease',
      }}
      onMouseDown={!isDrawingArrow && !postit.isEditing ? handleMouseDown : undefined}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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
    isEditing: PropTypes.bool.isRequired,
  }).isRequired,
  updatePostit: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDrawingArrow: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default React.memo(PostitContainer);