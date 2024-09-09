import React, { useCallback, useRef, useEffect, useState } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit/Postit';
import ArrowManager from './ArrowManager';
import EventStackDisplay from './EventStackDisplay';
import { useKeyboardEvent } from '../hooks/useKeyboardEvent';
import usePostitBoard from '../hooks/usePostitBoard';

const PostitBoard = () => {
  console.log('Rendering PostitBoard');
  const [topOffset, setTopOffset] = useState(0);

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

  console.log('PostitBoard state:', { 
    postitsCount: postits.length, 
    arrowsCount: arrows.length, 
    selectedPostit, 
    selectedArrow, 
    arrowStart,
    canUndo,
    canRedo
  });

  const boardRef = useRef(null);
  const arrowManagerRef = useRef(null);

  useEffect(() => {
    console.log('PostitBoard mounted or updated');
    const calculateTopOffset = () => {
      const offset = window.outerHeight - window.innerHeight;
      setTopOffset(offset);
    };

    calculateTopOffset();
    window.addEventListener('resize', calculateTopOffset);

    return () => {
      console.log('PostitBoard will unmount');
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
      createPostit(x, y);
    }
  }, [arrowStart, createPostit]);

  const handleSelectPostit = useCallback((id) => {
    console.log('Selecting postit', id);
    setSelectedPostit(id);
    setSelectedArrow(null);
  }, [setSelectedPostit, setSelectedArrow]);

  const handleStartConnection = useCallback((id, position) => {
    console.log('Starting connection from postit', id, 'at position', position);
    setArrowStart({ id, position });
  }, [setArrowStart]);

  const handleBoardClick = useCallback((event) => {
    console.log('Board clicked');
    if (arrowStart) {
      console.log('Handling canvas click for arrow creation');
      arrowManagerRef.current.handleCanvasClick(event);
    } else {
      console.log('Deselecting postit and arrow');
      setSelectedPostit(null);
      setSelectedArrow(null);
    }
  }, [arrowStart, setSelectedPostit, setSelectedArrow]);

  const handlePostitClick = useCallback((event, postitId) => {
    console.log('Postit clicked', postitId);
    if (arrowStart && arrowStart.id !== postitId) {
      console.log('Handling postit click for arrow creation');
      arrowManagerRef.current.handlePostitClick(event, postitId);
    } else {
      handleSelectPostit(postitId);
    }
  }, [arrowStart, handleSelectPostit]);

  const handleCreateArrow = useCallback((newArrow) => {
    console.log('Creating new arrow', newArrow);
    createArrow(newArrow);
  }, [createArrow]);

  const handleCreatePostitAndArrow = useCallback((x, y, startPostitId) => {
    console.log('Creating new postit and arrow', { x, y, startPostitId });
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
      
      console.log('Creating arrow between postits', newArrow);
      createArrow(newArrow);
    }
    return newPostit;
  }, [postits, createPostit, createArrow]);

  const handleArrowClick = useCallback((event, arrowId) => {
    console.log('Arrow clicked', arrowId);
    event.stopPropagation();
    setSelectedArrow(arrowId);
    setSelectedPostit(null);
  }, [setSelectedArrow, setSelectedPostit]);

  useKeyboardEvent('Delete', () => {
    console.log('Delete key pressed');
    deleteSelectedItem();
  }, [deleteSelectedItem]);

  useKeyboardEvent('z', () => {
    console.log('Undo keyboard shortcut used');
    handleUndo();
  }, [handleUndo], { ctrlKey: true, triggerOnInput: false });

  useKeyboardEvent('y', () => {
    console.log('Redo keyboard shortcut used');
    handleRedo();
  }, [handleRedo], { ctrlKey: true, triggerOnInput: false });
  
  console.log('Rendering PostitBoard JSX');
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
        {console.log('Rendering undo/redo buttons', { canUndo, canRedo })}
        <button 
          onClick={() => {
            console.log('Undo button clicked');
            handleUndo();
          }} 
          disabled={!canUndo}
          style={{
            padding: '8px 15px',
            backgroundColor: canUndo ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
        >
          Undo
        </button>
        <button 
          onClick={() => {
            console.log('Redo button clicked');
            handleRedo();
          }} 
          disabled={!canRedo}
          style={{
            padding: '8px 15px',
            backgroundColor: canRedo ? '#2ecc71' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
        >
          Redo
        </button>
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