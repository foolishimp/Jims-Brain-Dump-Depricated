// src/hooks/useAutoSave.js

import { useState, useEffect, useCallback } from 'react';
import { autoSaveDiagram } from '../utils/exportUtils';
import { checkForNewEvents } from '../utils/eventUtils';

const useAutoSave = (postits, arrows, filename, eventLog, isAutoSaveEnabled) => {
  const [autoSaveIndex, setAutoSaveIndex] = useState(0);
  const [lastAutoSaveEventLogLength, setLastAutoSaveEventLogLength] = useState(0);

  const handleAutoSave = useCallback(async () => {
    const hasNewEvents = checkForNewEvents(eventLog, lastAutoSaveEventLogLength);
    if (hasNewEvents) {
      try {
        const newIndex = await autoSaveDiagram(postits, arrows, filename, autoSaveIndex);
        setAutoSaveIndex(newIndex);
        setLastAutoSaveEventLogLength(eventLog.past.length + eventLog.currentSequence.length);
        console.log('Auto-save triggered');
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Optionally, you can implement a user notification system here
      }
    } else {
      console.log('No new events, skipping auto-save');
    }
  }, [postits, arrows, filename, autoSaveIndex, eventLog, lastAutoSaveEventLogLength]);

  useEffect(() => {
    let autoSaveInterval;
    if (isAutoSaveEnabled) {
      autoSaveInterval = setInterval(handleAutoSave, 10000); // Check every 10 seconds
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [isAutoSaveEnabled, handleAutoSave]);

  return {
    autoSaveIndex,
    lastAutoSaveEventLogLength,
  };
};

export default useAutoSave;