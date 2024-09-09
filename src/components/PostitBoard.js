import React, { useState, useCallback, useRef } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit/Postit';
import ArrowManager from './ArrowManager';
import { createNewPostit } from '../utils/postit';
import { useKeyboardEvent } from '../hooks/useKeyboardEvent';

const PostitBoard = () => {
  const [postits, setPostits] = useState([]);
  const [selectedPostit, setSelectedPostit] = useState(null);
  const [arrowStart, setArrowStart] = useState(null);
  const [arrows, setArrows] = useState([]);
  const boardRef = useRef(null);
  const arrowManagerRef = useRef(null);

  const handleDoubleClick = useCallback((event, zoom, position) => {
    if (!arrowStart && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - position.x) / zoom;
      const y = (event.clientY - rect.top - position.y) / zoom;
      const newPostit = createNewPostit(x, y);
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
    setArrowStart({ id, position });
  }, []);

  const handleBoardClick = useCallback((event) => {
    if (arrowStart) {
      setArrowStart(null);
    } else {
      setSelectedPostit(null);
    }
  }, [arrowStart]);

  const handlePostitClick = useCallback((event, postitId) => {
    if (arrowStart && arrowStart.id !== postitId) {
      arrowManagerRef.current.handlePostitClick(event, postitId);
    } else {
      handleSelectPostit(postitId);
    }
  }, [arrowStart, handleSelectPostit]);

  const deleteSelectedPostit = useCallback(() => {
    if (selectedPostit) {
      setPostits((prevPostits) => prevPostits.filter((postit) => postit.id !== selectedPostit));
      setArrows((prevArrows) => prevArrows.filter((arrow) => arrow.startId !== selectedPostit && arrow.endId !== selectedPostit));
      setSelectedPostit(null);
    }
  }, [selectedPostit]);

  useKeyboardEvent('Delete', deleteSelectedPostit, [selectedPostit]);

  return (
    <div ref={boardRef} onClick={handleBoardClick} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <InfiniteCanvas 
        onDoubleClick={(event, zoom, position) => handleDoubleClick(event, zoom, position)}
        disablePanZoom={!!arrowStart}
      >
        {({ zoom, position }) => (
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
              ref={arrowManagerRef}
              postits={postits}
              arrows={arrows}
              setArrows={setArrows}
              arrowStart={arrowStart}
              setArrowStart={setArrowStart}
              boardRef={boardRef}
              zoom={zoom}
              position={position}
            />
          </>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;