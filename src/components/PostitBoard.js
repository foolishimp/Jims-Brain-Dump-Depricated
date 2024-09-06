import React, { useState, useCallback, useEffect } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit';
import ArrowManager from './ArrowManager';
import { createNewPostit } from '../utils/postit';

const VERSION = "PostitBoard v2";

const PostitBoard = () => {
  const [postits, setPostits] = useState([]);
  const [selectedPostit, setSelectedPostit] = useState(null);
  const [arrowDragMode, setArrowDragMode] = useState(null);
  const [arrows, setArrows] = useState([]);

  useEffect(() => {
    console.log(`${VERSION} - Component mounted`);
  }, []);

  useEffect(() => {
    console.log(`${VERSION} - ArrowDragMode changed:`, arrowDragMode);
    console.log(`${VERSION} - Selected Postit:`, selectedPostit);
  }, [arrowDragMode, selectedPostit]);

  const handleDoubleClick = useCallback((event) => {
    if (!arrowDragMode) {
      const { clientX, clientY } = event;
      const newPostit = createNewPostit(clientX, clientY);
      console.log(`${VERSION} - Creating new postit:`, newPostit);
      setPostits((prevPostits) => [...prevPostits, newPostit]);
    }
  }, [arrowDragMode]);

  const updatePostit = useCallback((id, updates) => {
    console.log(`${VERSION} - Updating postit ${id}:`, updates);
    setPostits((prevPostits) =>
      prevPostits.map((postit) =>
        postit.id === id ? { ...postit, ...updates } : postit
      )
    );
  }, []);

  const handleSelectPostit = useCallback((id) => {
    console.log(`${VERSION} - Selecting postit:`, id, 'Current arrowDragMode:', arrowDragMode);
    if (arrowDragMode) {
      // Complete arrow drawing
      if (id !== arrowDragMode.startId) {
        const startPostit = postits.find(p => p.id === arrowDragMode.startId);
        const endPostit = postits.find(p => p.id === id);
        if (startPostit && endPostit) {
          const newArrow = {
            id: Date.now().toString(),
            startId: arrowDragMode.startId,
            startPosition: arrowDragMode.startPosition,
            endId: id,
            startX: startPostit.x + (arrowDragMode.startPosition === 'left' ? 0 : arrowDragMode.startPosition === 'right' ? 200 : 100),
            startY: startPostit.y + (arrowDragMode.startPosition === 'top' ? 0 : arrowDragMode.startPosition === 'bottom' ? 150 : 75),
            endX: endPostit.x + 100,
            endY: endPostit.y + 75,
          };
          console.log(`${VERSION} - Creating new arrow:`, newArrow);
          setArrows(prev => [...prev, newArrow]);
        }
      }
      setArrowDragMode(null);
    } else {
      setSelectedPostit(id);
    }
  }, [arrowDragMode, postits]);

  const handleStartConnection = useCallback((id, position) => {
    console.log(`${VERSION} - Starting connection:`, id, position);
    setArrowDragMode({ startId: id, startPosition: position });
  }, []);

  const handleEndConnection = useCallback(() => {
    console.log(`${VERSION} - Ending connection`);
    setArrowDragMode(null);
  }, []);

  const handleCanvasClick = useCallback((event) => {
    console.log(`${VERSION} - Canvas clicked`, event.target);
    if (arrowDragMode && !event.target.closest('.postit')) {
      handleEndConnection();
    } else if (!event.target.closest('.postit')) {
      setSelectedPostit(null);
    }
  }, [arrowDragMode, handleEndConnection]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', cursor: arrowDragMode ? 'crosshair' : 'default' }}>
      <InfiniteCanvas onDoubleClick={handleDoubleClick} disablePanZoom={!!arrowDragMode}>
        {({ zoom }) => (
          <div 
            style={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
            }}
            onClick={handleCanvasClick}
          >
            {postits.map((postit) => (
              <Postit
                key={postit.id}
                postit={postit}
                updatePostit={updatePostit}
                zoom={zoom}
                isSelected={selectedPostit === postit.id}
                onSelect={handleSelectPostit}
                onStartConnection={handleStartConnection}
                isDrawingArrow={!!arrowDragMode}
              />
            ))}
            <ArrowManager
              postits={postits}
              arrowDragMode={arrowDragMode}
              onEndConnection={handleEndConnection}
              arrows={arrows}
            />
          </div>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;