import { useEffect, useCallback } from 'react';

export const useKeyboardEvent = (key, callback, deps = []) => {
  // Include callback in the dependency array of useCallback
  const memoizedCallback = useCallback(callback, [callback, ...deps]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === key) {
        memoizedCallback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [key, memoizedCallback]);
};