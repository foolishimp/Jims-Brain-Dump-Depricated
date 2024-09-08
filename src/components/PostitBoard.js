import React, { useState, useCallback, useRef, useEffect } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit';
import ArrowManager from './ArrowManager';
import { createNewPostit } from '../utils/postit';

const PostitBoard = () => {
  const [postits, setPostits] = useState([]);
  const [selectedPostit, setSelectedPostit] = useState(null);
  const [arrowStart, setArrowStart] = useState(null);
  const boardRef = useRef(null);

  const arrowManager = ArrowManager({ postits, arrowStart, setArrowStart, boardRef, zoom: 1 });

  useEffect(() => {
    console.log(`PostitBoard - Selected Postit: ${selectedPostit}, Arrow Start: ${JSON.stringify(arrowStart)}`);
  }, [selectedPostit, arrowStart]);

  const handleDoubleClick = useCallback((event) => {
    console.log('PostitBoard - DoubleClick event');
    if (!arrowStart) {
      const { clientX, clientY } = event;
      const newPostit = createNewPostit(clientX, clientY);
      setPostits((prevPostits) => [...prevPostits, newPostit]);
    }
  }, [arrowStart]);

  const updatePostit = useCallback((id, updates) => {
    console.log(`PostitBoard - Updating Postit ${id}`, updates);
    setPostits((prevPostits) =>
      prevPostits.map((postit) =>
        postit.id === id ? { ...postit, ...updates } : postit
      )
    );
  }, []);

  const handleSelectPostit = useCallback((id) => {
    console.log(`PostitBoard - Selecting Postit ${id}`);
    setSelectedPostit(id);
  }, []);

  const handleStartConnection = useCallback((id, position) => {
    console.log(`PostitBoard - Starting connection from Postit ${id} at ${position}`);
    setArrowStart({ id, position });
  }, []);

  const handleBoardClick = useCallback((event) => {
    console.log('PostitBoard - Board Click event');
    if (arrowStart) {
      setArrowStart(null);
    } else {
      setSelectedPostit(null);
    }
  }, [arrowStart]);

  return (
    <div ref={boardRef} onClick={handleBoardClick} style={{ width: '100%', height: '100%' }}>
      <InfiniteCanvas 
        onDoubleClick={handleDoubleClick}
        disablePanZoom={!!arrowStart}
        params={{
          minZoom: 0.2,
          maxZoom: 3,
          zoomFactor: 0.05,
          panFactor: 1,
        }}
      >
        {({ zoom }) => (
          <>
            {postits.map((postit) => (
              <Postit
                key={postit.id}
                postit={postit}
                updatePostit={updatePostit}
                zoom={zoom}
                isSelected={selectedPostit === postit.id}
                onSelect={handleSelectPostit}
                onStartConnection={handleStartConnection}
                onPostitClick={arrowManager.handlePostitClick}
                isDrawingArrow={!!arrowStart}
              />
            ))}
            {arrowManager.renderArrows()}
          </>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;