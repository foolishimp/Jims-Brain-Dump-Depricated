import React, { useState, useCallback, useRef } from 'react';
import InfiniteCanvas from './InfiniteCanvas';
import Postit from './Postit/Postit';
import ArrowManager from './ArrowManager';
import { createNewPostit } from '../utils/postit';
import { useKeyboardEvent } from '../hooks/useKeyboardEvent';
import { createEventLog, logEvent, undo, redo } from '../utils/eventLogUtils';
import { postitEventHandlers } from '../utils/postitEvents';
import { arrowEventHandlers } from '../utils/arrowEvents';

const PostitBoard = () => {
  const [postits, setPostits] = useState([]);
  const [selectedPostit, setSelectedPostit] = useState(null);
  const [arrowStart, setArrowStart] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [eventLog, setEventLog] = useState(createEventLog());
  const boardRef = useRef(null);
  const arrowManagerRef = useRef(null);

  const handleEvent = useCallback((event) => {
    setEventLog((prevLog) => {
      const newLog = logEvent(prevLog, event);
      // Apply the event immediately
      let newState = { postits, arrows };
      switch (event.target) {
        case 'Postit':
          newState.postits = postitEventHandlers.redo(event, { postits }).postits;
          break;
        case 'Arrow':
          newState.arrows = arrowEventHandlers.redo(event, { arrows }).arrows;
          break;
        default:
          console.warn(`Unhandled event target: ${event.target}`);
      }
      setPostits(newState.postits);
      setArrows(newState.arrows);
      return newLog;
    });
  }, [postits, arrows]);

  const handleDoubleClick = useCallback((event, zoom, position) => {
    if (!arrowStart && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - position.x) / zoom;
      const y = (event.clientY - rect.top - position.y) / zoom;
      const newPostit = createNewPostit(x, y);
      handleEvent({
        target: 'Postit',
        action: 'CREATE',
        data: newPostit,
      });
    }
  }, [arrowStart, handleEvent]);

  const updatePostit = useCallback((id, updates) => {
    const postit = postits.find((p) => p.id === id);
    if (updates.x !== undefined && updates.y !== undefined) {
      handleEvent({
        target: 'Postit',
        action: 'MOVE',
        data: {
          id,
          oldX: postit.x,
          oldY: postit.y,
          newX: updates.x,
          newY: updates.y,
        },
      });
    } else if (updates.text !== undefined) {
      handleEvent({
        target: 'Postit',
        action: 'EDIT',
        data: {
          id,
          oldText: postit.text,
          newText: updates.text,
        },
      });
    } else if (updates.color !== undefined) {
      handleEvent({
        target: 'Postit',
        action: 'CHANGE_COLOR',
        data: {
          id,
          oldColor: postit.color,
          newColor: updates.color,
        },
      });
    }
  }, [postits, handleEvent]);

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
      const deletedPostit = postits.find((p) => p.id === selectedPostit);
      const connectedArrows = arrows.filter(
        (arrow) =>
          arrow.startId === selectedPostit || arrow.endId === selectedPostit
      );
      handleEvent({
        target: 'Postit',
        action: 'DELETE',
        data: {
          postit: deletedPostit,
          connectedArrows,
        },
      });
      setSelectedPostit(null);
    }
  }, [selectedPostit, postits, arrows, handleEvent]);

  const handleUndo = useCallback(() => {
    setEventLog((prevLog) => {
      const { eventLog: newLog, newState } = undo(prevLog, { postits, arrows });
      setPostits(newState.postits);
      setArrows(newState.arrows);
      return newLog;
    });
  }, [postits, arrows]);

  const handleRedo = useCallback(() => {
    setEventLog((prevLog) => {
      const { eventLog: newLog, newState } = redo(prevLog, { postits, arrows });
      setPostits(newState.postits);
      setArrows(newState.arrows);
      return newLog;
    });
  }, [postits, arrows]);

  useKeyboardEvent('Delete', deleteSelectedPostit, [selectedPostit]);

  return (
    <div ref={boardRef} onClick={handleBoardClick} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <button onClick={handleUndo} disabled={eventLog.past.length === 0 && eventLog.currentSequence.length === 0}>Undo</button>
        <button onClick={handleRedo} disabled={eventLog.future.length === 0}>Redo</button>
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
              onCreateArrow={(arrow) => {
                handleEvent({
                  target: 'Arrow',
                  action: 'CREATE',
                  data: arrow,
                });
              }}
            />
          </>
        )}
      </InfiniteCanvas>
    </div>
  );
};

export default PostitBoard;