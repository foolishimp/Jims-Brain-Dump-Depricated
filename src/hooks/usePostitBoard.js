import { useState, useCallback } from 'react';
import { createNewPostit } from '../utils/postit';
import { postitEventHandlers } from '../utils/postitEvents';
import { arrowEventHandlers } from '../utils/arrowEvents';
import { createEventLog, logEvent, undo, redo } from '../utils/eventLogUtils';

const usePostitBoard = () => {
  const [postits, setPostits] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [selectedPostit, setSelectedPostit] = useState(null);
  const [selectedArrow, setSelectedArrow] = useState(null);
  const [arrowStart, setArrowStart] = useState(null);
  const [eventLog, setEventLog] = useState(createEventLog());

  const handleEvent = useCallback((event) => {
    setEventLog((prevLog) => {
      const newLog = logEvent(prevLog, event);
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

  const createPostit = useCallback((x, y) => {
    const newPostit = createNewPostit(x, y);
    handleEvent({
      target: 'Postit',
      action: 'CREATE',
      data: newPostit,
    });
    return newPostit;
  }, [handleEvent]);

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

  const createArrow = useCallback((newArrow) => {
    handleEvent({
      target: 'Arrow',
      action: 'CREATE',
      data: newArrow,
    });
    // Immediately update the arrows state to ensure rendering
    setArrows(prevArrows => [...prevArrows, newArrow]);
  }, [handleEvent]);

  const deleteSelectedItem = useCallback(() => {
    if (selectedPostit) {
      const deletedPostit = postits.find((p) => p.id === selectedPostit);
      const connectedArrows = arrows.filter(
        (arrow) => arrow.startId === selectedPostit || arrow.endId === selectedPostit
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
    } else if (selectedArrow) {
      const deletedArrow = arrows.find((a) => a.id === selectedArrow);
      handleEvent({
        target: 'Arrow',
        action: 'DELETE',
        data: deletedArrow,
      });
      setSelectedArrow(null);
    }
  }, [selectedPostit, selectedArrow, postits, arrows, handleEvent]);

  return {
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
    handleEvent,
    handleUndo,
    handleRedo,
    canUndo: eventLog.past.length > 0 || eventLog.currentSequence.length > 0,
    canRedo: eventLog.future.length > 0,
    eventLog,
  };
};

export default usePostitBoard;