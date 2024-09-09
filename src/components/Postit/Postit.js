import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import PostitContainer from './PostitContainer';
import PostitContent from './PostitContent';
import ConnectionPoints from './ConnectionPoints';
import ColorMenu from './ColorMenu';
import { POSTIT_COLORS } from '../../utils/colorUtils';

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
  const [showColorMenu, setShowColorMenu] = useState(false);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (isDrawingArrow) {
      onPostitClick(event, postit.id);
    } else {
      onSelect(postit.id);
    }
  }, [postit.id, onSelect, onPostitClick, isDrawingArrow]);

  const handleDoubleClick = useCallback((event) => {
    event.stopPropagation();
    updatePostit(postit.id, { isEditing: true });
  }, [postit.id, updatePostit]);

  const handleStartConnection = useCallback((position) => {
    onStartConnection(postit.id, position);
  }, [postit.id, onStartConnection]);

  const handleUpdatePostit = useCallback((updates) => {
    updatePostit(postit.id, updates);
  }, [postit.id, updatePostit]);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    setShowColorMenu(true);
  }, []);

  const handleColorChange = useCallback((color) => {
    updatePostit(postit.id, { color });
    setShowColorMenu(false);
  }, [postit.id, updatePostit]);

  return (
    <PostitContainer
      postit={postit}
      updatePostit={handleUpdatePostit}
      zoom={zoom}
      isSelected={isSelected}
      isDrawingArrow={isDrawingArrow}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <PostitContent
        postit={postit}
        updatePostit={handleUpdatePostit}
        onDoubleClick={handleDoubleClick}
      />
      {isSelected && !isDrawingArrow && (
        <ConnectionPoints
          onStartConnection={handleStartConnection}
          width={200}
          height={150}
        />
      )}
      {showColorMenu && (
        <ColorMenu
          colors={POSTIT_COLORS}
          onColorSelect={handleColorChange}
          onClose={() => setShowColorMenu(false)}
        />
      )}
    </PostitContainer>
  );
};

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

export default React.memo(Postit);