import { useEffect, useCallback } from 'react';

export const useKeyboardEvent = (key, callback, deps = [], options = {}) => {
  const memoizedCallback = useCallback(callback, [callback, ...deps]);

  useEffect(() => {
    const handler = (event) => {
      // Check if the active element is an input or textarea
      const isInputActive = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

      // Only trigger the callback if it's not an input/textarea or if we explicitly allow it
      if ((!isInputActive || options.triggerOnInput) && event.key === key) {
        if (options.ctrlKey && !event.ctrlKey) return;
        if (options.shiftKey && !event.shiftKey) return;
        if (options.altKey && !event.altKey) return;
        if (options.metaKey && !event.metaKey) return;

        event.preventDefault();
        memoizedCallback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [key, memoizedCallback, options]);
};