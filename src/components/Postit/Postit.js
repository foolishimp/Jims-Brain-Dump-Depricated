import React, { useCallback, memo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import PostitContainer from './PostitContainer';
import PostitContent from './PostitContent';
import ConnectionPoints from './ConnectionPoints';
import ColorMenu from './ColorMenu';
import { POSTIT_COLORS } from '../../utils/colorUtils';

const Postit = memo(({
  postit,
  updatePostit,
  zoom,
  isSelected,
  onSelect,
  onStartConnection,
  onPostitClick,
  isDrawingArrow
}) => {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const colorMenuRef = useRef(null);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (!showColorMenu) {
      if (isDrawingArrow) {
        onPostitClick(event, postit.id);
      } else {
        onSelect(postit.id);
      }
    }
  }, [postit.id, onSelect, onPostitClick, isDrawingArrow, showColorMenu]);

  const handleDoubleClick = useCallback((event) => {
    event.stopPropagation();
    console.log(`Double-click detected on Postit ${postit.id}`);
    updatePostit(postit.id, { isEditing: true });
  }, [postit.id, updatePostit]);
  
  const handleStartConnection = useCallback((position) => {
    if (!showColorMenu) {
      onStartConnection(postit.id, position);
    }
  }, [postit.id, onStartConnection, showColorMenu]);

  const handleUpdatePostit = useCallback((updates) => {
    updatePostit(postit.id, updates);
  }, [postit.id, updatePostit]);

  const handleStopEditing = useCallback(() => {
    updatePostit(postit.id, { isEditing: false });
  }, [postit.id, updatePostit]);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowColorMenu(true);
  }, []);

  const handleColorSelect = useCallback((color) => {
    updatePostit(postit.id, { color });
    setShowColorMenu(false);
  }, [postit.id, updatePostit]);

  const handleCloseColorMenu = useCallback(() => {
    setShowColorMenu(false);
  }, []);

  return (
    <PostitContainer
      postit={postit}
      updatePostit={handleUpdatePostit}
      zoom={zoom}
      isSelected={isSelected}
      isDrawingArrow={isDrawingArrow}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      <PostitContent
        postit={postit}
        updatePostit={handleUpdatePostit}
        onStopEditing={handleStopEditing}
      />
      {isSelected && !isDrawingArrow && !showColorMenu && (
        <ConnectionPoints
          onStartConnection={handleStartConnection}
          width={200}
          height={150}
        />
      )}
      {showColorMenu && (
        <div 
          ref={colorMenuRef} 
          style={{ 
            position: 'absolute', 
            right: 0, 
            top: '100%', 
            zIndex: 1000 // Ensure color menu is on top
          }}
          onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
        >
          <ColorMenu
            colors={POSTIT_COLORS}
            onColorSelect={handleColorSelect}
            onClose={handleCloseColorMenu}
          />
        </div>
      )}
    </PostitContainer>
  );
});

Postit.propTypes = {
  postit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    color: PropTypes.string,
  }).isRequired,
  updatePostit: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onStartConnection: PropTypes.func.isRequired,
  onPostitClick: PropTypes.func.isRequired,
  isDrawingArrow: PropTypes.bool.isRequired,
};

export default Postit;