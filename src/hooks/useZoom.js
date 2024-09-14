import { useState, useCallback, useMemo } from 'react';

const DEFAULT_ZOOM_PARAMS = {
  minZoom: 0.1,
  maxZoom: 1,
  zoomFactor: 1.1
};

const useZoom = (initialZoom = 1, initialPosition = { x: 0, y: 0 }, customZoomParams = {}) => {
  const zoomParams = useMemo(() => ({ ...DEFAULT_ZOOM_PARAMS, ...customZoomParams }), [customZoomParams]);
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState(initialPosition);

  const handleZoom = useCallback((delta, clientX, clientY) => {
    setZoom((prevZoom) => {
      const factor = delta > 0 ? zoomParams.zoomFactor : 1 / zoomParams.zoomFactor;
      const newZoom = Math.max(zoomParams.minZoom, Math.min(zoomParams.maxZoom, prevZoom * factor));
      
      setPosition((prevPosition) => {
        const mouseX = (clientX - prevPosition.x) / prevZoom;
        const mouseY = (clientY - prevPosition.y) / prevZoom;
        return {
          x: clientX - mouseX * newZoom,
          y: clientY - mouseY * newZoom
        };
      });

      return newZoom;
    });
  }, [zoomParams]);

  const handlePan = useCallback((deltaX, deltaY) => {
    setPosition((prevPosition) => ({
      x: prevPosition.x + deltaX,
      y: prevPosition.y + deltaY,
    }));
  }, []);

  return { zoom, position, handleZoom, handlePan };
};

export default useZoom;