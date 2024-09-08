import React, { useState, useCallback, useRef } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit';
import ArrowManager from './ArrowManager';
import { createNewPostit } from '../utils/postit';

const PostitBoard = () => {
  const [postits, setPostits] = useState([]);
  const [selectedPostit, setSelectedPostit] = useState(null);
  const [arrowStart, setArrowStart] = useState(null);
  const boardRef = useRef(null);

  const handleDoubleClick = useCallback((event) => {
    if (!arrowStart) {
      const { clientX, clientY } = event;
      const newPostit = createNewPostit(clientX, clientY);
      setPostits((prevPostits) => [...prevPostits, newPostit]);
    }
  }, [arrowStart]);

  const updatePostit = useCallback((id, updates) => {
    setPostits((prevPostits) =>
      prevPostits.map((postit) =>
        postit.id === id ? { ...postit, ...updates } : postit
      )
    );
  }, []);

  const handleSelectPostit = useCallback((id) => {
    setSelectedPostit(id);
  }, []);

  const handleStartConnection = useCallback((id, position) => {
    console.log(`PostitBoard - Starting connection from Postit ${id} at ${position}`);
    setArrowStart({ id, position });
  }, []);

  const handleBoardClick = useCallback((event) => {
    if (arrowStart) {
      console.log("PostitBoard - Cancelling arrow drawing");
      setArrowStart(null);
    } else {
      console.log("PostitBoard - Deselecting Postit");
      setSelectedPostit(null);
    }
  }, [arrowStart]);

  const handlePostitClick = useCallback((event, postitId) => {
    console.log(`PostitBoard - Postit ${postitId} clicked`);
    // Add any additional logic for Postit clicks here
  }, []);

  return (
    <div ref={boardRef} onClick={handleBoardClick} style={{ width: '100%', height: '100%' }}>
      <InfiniteCanvas 
        onDoubleClick={handleDoubleClick}
        disablePanZoom={!!arrowStart}
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
                onPostitClick={handlePostitClick}
                isDrawingArrow={!!arrowStart}
              />
            ))}
            <ArrowManager
              postits={postits}
              arrowStart={arrowStart}
              setArrowStart={setArrowStart}
              boardRef={boardRef}
              zoom={zoom}
            />
          </>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;