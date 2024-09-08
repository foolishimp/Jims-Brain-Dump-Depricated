import { useState, useCallback } from 'react';

const useZoom = (initialZoom = 1, initialPosition = { x: 0, y: 0 }, zoomParams = {}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState(initialPosition);

  const handleZoom = useCallback((delta, clientX, clientY) => {
    const factor = delta > 0 ? 1.1 : 0.9;
    setZoom((prevZoom) => {
      const newZoom = prevZoom * factor;
      const minZoom = zoomParams.minZoom || 0.1;
      const maxZoom = zoomParams.maxZoom || 5;
      return Math.max(minZoom, Math.min(maxZoom, newZoom));
    });

    setPosition((prevPosition) => ({
      x: clientX - (clientX - prevPosition.x) * factor,
      y: clientY - (clientY - prevPosition.y) * factor,
    }));
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