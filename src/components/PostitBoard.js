import React, { useCallback, useRef, useEffect, useState } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit/Postit';
import ArrowManager from './ArrowManager';
import EventStackDisplay from './EventStackDisplay';
import { useKeyboardEvent } from '../hooks/useKeyboardEvent';
import usePostitBoard from '../hooks/usePostitBoard';
import useAutoSave from '../hooks/useAutoSave';
import { exportDiagram } from '../utils/exportUtils';
import { importDiagram } from '../utils/importUtils';

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
    eventLog,
    setPostits,
    setArrows
  } = usePostitBoard();

  const [topOffset, setTopOffset] = useState(0);
  const [showEventStack, setShowEventStack] = useState(false);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false);
  const [filename, setFilename] = useState('diagram');
  const boardRef = useRef(null);
  const arrowManagerRef = useRef(null);

  useAutoSave(postits, arrows, filename, eventLog, isAutoSaveEnabled);

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

  const handleSave = useCallback(async () => {
    try {
      const newFilename = await exportDiagram(postits, arrows, filename);
      setFilename(newFilename);
    } catch (err) {
      console.error('Failed to save the diagram:', err);
    }
  }, [postits, arrows, filename]);

  const handleLoad = useCallback(async () => {
    try {
      const { filename: newFilename, data } = await importDiagram();
      setPostits(data.postits);
      setArrows(data.arrows);
      setFilename(newFilename);
    } catch (err) {
      console.error('Failed to load the diagram:', err);
    }
  }, [setPostits, setArrows]);

  const toggleAutoSave = useCallback(() => {
    setIsAutoSaveEnabled(prev => !prev);
  }, []);

  const toggleEventStack = useCallback(() => {
    setShowEventStack(prev => !prev);
  }, []);

  const handleBoardClick = useCallback((event) => {
    if (arrowStart) {
      arrowManagerRef.current.handleCanvasClick(event);
    } else {
      setSelectedPostit(null);
      setSelectedArrow(null);
    }
  }, [arrowStart, setSelectedPostit, setSelectedArrow]);

  const handleDoubleClick = useCallback((event, zoom, position) => {
    if (!arrowStart && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - position.x) / zoom;
      const y = (event.clientY - rect.top - position.y) / zoom;
      createPostit(x, y);
    }
  }, [arrowStart, createPostit]);

  const handleSelectPostit = useCallback((id) => {
    setSelectedPostit(id);
    setSelectedArrow(null);
  }, [setSelectedPostit, setSelectedArrow]);

  const handleStartConnection = useCallback((id, position) => {
    setArrowStart({ id, position });
  }, [setArrowStart]);

  const handlePostitClick = useCallback((event, postitId) => {
    if (arrowStart && arrowStart.id !== postitId) {
      arrowManagerRef.current.handlePostitClick(event, postitId);
    } else {
      handleSelectPostit(postitId);
    }
  }, [arrowStart, handleSelectPostit]);

  const handleUpdatePostit = useCallback((id, updates) => {
    updatePostit(id, updates);
  }, [updatePostit]);

  const handleCreatePostitAndArrow = useCallback((x, y, startPostitId) => {
    const newPostit = createPostit(x, y);
    if (newPostit && startPostitId) {
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
  }, [createPostit, createArrow]);

  useKeyboardEvent('Delete', deleteSelectedItem, [deleteSelectedItem]);
  useKeyboardEvent('z', handleUndo, [handleUndo], { ctrlKey: true, triggerOnInput: false });
  useKeyboardEvent('y', handleRedo, [handleRedo], { ctrlKey: true, triggerOnInput: false });

  return (
    <div ref={boardRef} onClick={handleBoardClick} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {showEventStack && <EventStackDisplay eventLog={eventLog} topOffset={topOffset} eventLimit={20} />}
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
        gap: '10px',
        alignItems: 'center'
      }}>
        <button onClick={handleUndo} disabled={!canUndo}>Undo</button>
        <button onClick={handleRedo} disabled={!canRedo}>Redo</button>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#ccc', margin: '0 10px' }} />
        <button onClick={handleSave}>Save</button>
        <label>
          <input
            type="checkbox"
            checked={isAutoSaveEnabled}
            onChange={toggleAutoSave}
          />
          Auto-save
        </label>
        <button onClick={handleLoad}>Load</button>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#ccc', margin: '0 10px' }} />
        <button 
          onClick={toggleEventStack}
          style={{
            backgroundColor: showEventStack ? '#4CAF50' : '#f0f0f0',
            color: showEventStack ? 'white' : 'black',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s'
          }}
        >
          Events
        </button>
      </div>
      <InfiniteCanvas 
        onDoubleClick={handleDoubleClick}
        disablePanZoom={!!arrowStart}
      >
        {({ zoom, position }) => (
          <>
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
              onArrowClick={setSelectedArrow}
              onCreateArrow={createArrow}
              onCreatePostitAndArrow={handleCreatePostitAndArrow}
            />
            {postits.map((postit) => (
              <Postit
                key={postit.id}
                postit={postit}
                updatePostit={handleUpdatePostit}
                zoom={zoom}
                isSelected={selectedPostit === postit.id}
                onSelect={handleSelectPostit}
                onStartConnection={handleStartConnection}
                onPostitClick={handlePostitClick}
                isDrawingArrow={!!arrowStart}
              />
            ))}
          </>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;