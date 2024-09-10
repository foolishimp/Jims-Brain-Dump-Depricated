// src/utils/eventUtils.js

export const checkForNewEvents = (eventLog, lastAutoSaveEventLogLength) => {
    const currentEventLogLength = eventLog.past.length + eventLog.currentSequence.length;
    return currentEventLogLength > lastAutoSaveEventLogLength;
  };