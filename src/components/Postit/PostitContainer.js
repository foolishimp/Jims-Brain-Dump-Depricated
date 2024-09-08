import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useDraggable from '../../hooks/useDraggable';
import useZoomAdjustment from '../../hooks/useZoomAdjustment';
import styles from '../../styles/Postit.module.css';

const PostitContainer = ({ postit, updatePostit, zoom, isSelected, isDrawingArrow, onClick, children }) => {
  const { fontSize } = useZoomAdjustment(zoom);

  useEffect(() => {
    console.log('PostitContainer props:', { postit, zoom, isSelected, isDrawingArrow });
  }, [postit, zoom, isSelected, isDrawingArrow]);

  const { isDragging, handleMouseDown } = useDraggable(
    postit && typeof postit.x === 'number' && typeof postit.y === 'number' ? { x: postit.x, y: postit.y } : null,
    (newPosition) => {
      console.log('Updating postit position:', newPosition);
      updatePostit({ x: newPosition.x, y: newPosition.y });
    },
    zoom
  );

  if (!postit || typeof postit.x !== 'number' || typeof postit.y !== 'number') {
    console.error('Invalid postit data:', postit);
    return null;
  }

  return (
    <div
      className={`${styles.postitContainer} ${isSelected ? styles.selected : ''}`}
      style={{
        left: `${postit.x}px`,
        top: `${postit.y}px`,
        fontSize: `${fontSize}px`,
        cursor: isDragging ? 'grabbing' : (isDrawingArrow ? 'crosshair' : 'grab'),
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={(e) => {
        console.log('MouseDown event on PostitContainer');
        handleMouseDown(e);
      }}
      onClick={(e) => {
        console.log('Click event on PostitContainer');
        onClick(e);
      }}
    >
      {children}
    </div>
  );
};

PostitContainer.propTypes = {
  postit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  updatePostit: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDrawingArrow: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default React.memo(PostitContainer);