import React, { useCallback, useRef, useEffect, useState } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit/Postit';
import ArrowManager from './ArrowManager';
import EventStackDisplay from './EventStackDisplay';
import { useKeyboardEvent } from '../hooks/useKeyboardEvent';
import usePostitBoard from '../hooks/usePostitBoard';

const PostitBoard = () => {
  const {
    postits,
    arrows,
    selectedPostit,
    selectedArrow,
    arrowStart,
    setSelectedPostit,
    setSelectedArrow,
    setArrowStart,
    createPostit,
    updatePostit,
    createArrow,
    deleteSelectedItem,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    eventLog
  } = usePostitBoard();

  const [topOffset, setTopOffset] = useState(0);
  const boardRef = useRef(null);
  const arrowManagerRef = useRef(null);

  useEffect(() => {
    const calculateTopOffset = () => {
      const offset = window.outerHeight - window.innerHeight;
      setTopOffset(offset);
    };

    calculateTopOffset();
    window.addEventListener('resize', calculateTopOffset);

    return () => {
      window.removeEventListener('resize', calculateTopOffset);
    };
  }, []);
  
  const handleDoubleClick = useCallback((event, zoom, position) => {
    console.log('Double click on board', { zoom, position });
    if (!arrowStart && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - position.x) / zoom;
      const y = (event.clientY - rect.top - position.y) / zoom;
      console.log('Creating new postit at', { x, y });
      const newPostit = createPostit(x, y);
      if (!newPostit) {
        console.error('Failed to create new postit');
      }
    }
  }, [arrowStart, createPostit]);

  const handleSelectPostit = useCallback((id) => {
    setSelectedPostit(id);
    setSelectedArrow(null);
  }, [setSelectedPostit, setSelectedArrow]);

  const handleStartConnection = useCallback((id, position) => {
    setArrowStart({ id, position });
  }, [setArrowStart]);

  const handleBoardClick = useCallback((event) => {
    if (arrowStart) {
      arrowManagerRef.current.handleCanvasClick(event);
    } else {
      setSelectedPostit(null);
      setSelectedArrow(null);
    }
  }, [arrowStart, setSelectedPostit, setSelectedArrow]);

  const handlePostitClick = useCallback((event, postitId) => {
    if (arrowStart && arrowStart.id !== postitId) {
      arrowManagerRef.current.handlePostitClick(event, postitId);
    } else {
      handleSelectPostit(postitId);
    }
  }, [arrowStart, handleSelectPostit]);

  const handleCreateArrow = useCallback((newArrow) => {
    console.log('Creating new arrow in PostitBoard:', newArrow);
    createArrow(newArrow);
  }, [createArrow]);

  const handleCreatePostitAndArrow = useCallback((x, y, startPostitId) => {
    const newPostit = createPostit(x, y);
    const startPostit = postits.find(p => p.id === startPostitId);
    
    if (startPostit && newPostit) {
      const newArrow = {
        id: Date.now().toString(),
        startId: startPostitId,
        endId: newPostit.id,
        startPosition: 'right',
        endPosition: 'left',
      };
      
      createArrow(newArrow);
    }
    return newPostit;
  }, [postits, createPostit, createArrow]);

  const handleArrowClick = useCallback((event, arrowId) => {
    event.stopPropagation();
    setSelectedArrow(arrowId);
    setSelectedPostit(null);
  }, [setSelectedArrow, setSelectedPostit]);

  useKeyboardEvent('Delete', deleteSelectedItem, [deleteSelectedItem]);
  useKeyboardEvent('z', handleUndo, [handleUndo], { ctrlKey: true, triggerOnInput: false });
  useKeyboardEvent('y', handleRedo, [handleRedo], { ctrlKey: true, triggerOnInput: false });

  return (
    <div ref={boardRef} onClick={handleBoardClick} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <EventStackDisplay eventLog={eventLog} topOffset={topOffset} eventLimit={20} />
      <div style={{ 
        position: 'fixed', 
        top: `${topOffset + 20}px`, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '10px 15px',
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        gap: '10px'
      }}>
        <button onClick={handleUndo} disabled={!canUndo}>Undo</button>
        <button onClick={handleRedo} disabled={!canRedo}>Redo</button>
      </div>
      <InfiniteCanvas 
        onDoubleClick={handleDoubleClick}
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
              arrowStart={arrowStart}
              setArrowStart={setArrowStart}
              boardRef={boardRef}
              zoom={zoom}
              position={position}
              selectedArrow={selectedArrow}
              onArrowClick={handleArrowClick}
              onCreateArrow={handleCreateArrow}
              onCreatePostitAndArrow={handleCreatePostitAndArrow}
            />
          </>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;