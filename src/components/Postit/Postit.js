import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import PostitContainer from './PostitContainer';
import PostitContent from './PostitContent';
import ConnectionPoints from './ConnectionPoints';

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
    console.log(`Double-click detected on Postit ${postit.id}`);
    updatePostit(postit.id, { isEditing: true });
  }, [postit.id, updatePostit]);
  
  const handleStartConnection = useCallback((position) => {
    onStartConnection(postit.id, position);
  }, [postit.id, onStartConnection]);

  const handleUpdatePostit = useCallback((updates) => {
    updatePostit(postit.id, updates);
  }, [postit.id, updatePostit]);

  const handleStopEditing = useCallback(() => {
    updatePostit(postit.id, { isEditing: false });
  }, [postit.id, updatePostit]);

  return (
    <PostitContainer
      postit={postit}
      updatePostit={handleUpdatePostit}
      zoom={zoom}
      isSelected={isSelected}
      isDrawingArrow={isDrawingArrow}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <PostitContent
        postit={postit}
        updatePostit={handleUpdatePostit}
        onStopEditing={handleStopEditing}
      />
      {isSelected && !isDrawingArrow && (
        <ConnectionPoints
          onStartConnection={handleStartConnection}
          width={200}
          height={150}
        />
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