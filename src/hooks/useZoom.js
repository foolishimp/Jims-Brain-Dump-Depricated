import { useState, useCallback, useMemo } from 'react';

const defaultParams = {
  minZoom: 0.1,
  maxZoom: 5,
  zoomFactor: 0.05,
  panFactor: 1,
};

export const useZoom = (initialZoom = 1, initialPosition = { x: 0, y: 0 }, params = {}) => {
  const zoomParams = useMemo(() => ({ ...defaultParams, ...params }), [params]);
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState(initialPosition);

  const handleZoom = useCallback((delta, centerX, centerY) => {
    setZoom(prevZoom => {
      const newZoom = Math.max(
        zoomParams.minZoom,
        Math.min(zoomParams.maxZoom, prevZoom * (1 + delta * zoomParams.zoomFactor))
      );
      const newX = centerX - (centerX - position.x) * (newZoom / prevZoom);
      const newY = centerY - (centerY - position.y) * (newZoom / prevZoom);
      setPosition({ x: newX, y: newY });
      return newZoom;
    });
  }, [position, zoomParams]);

  const handlePan = useCallback((deltaX, deltaY) => {
    setPosition(prev => ({
      x: prev.x + deltaX * zoomParams.panFactor,
      y: prev.y + deltaY * zoomParams.panFactor,
    }));
  }, [zoomParams.panFactor]);

  return {
    zoom,
    position,
    handleZoom,
    handlePan,
    setPosition,
  };
};