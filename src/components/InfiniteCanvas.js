import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';

const defaultParams = {
  minZoom: 0.1,
  maxZoom: 5,
  zoomFactor: 0.05,
  panFactor: 1,
};

const InfiniteCanvas = ({
  children,
  onDoubleClick,
  disablePanZoom,
  params = {}
}) => {
  const canvasParams = useMemo(() => ({ ...defaultParams, ...params }), [params]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (disablePanZoom) return;
    if (e.button === 0) {
      setIsDragging(true);
      setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [disablePanZoom, position]);

  const handleMouseMove = useCallback((e) => {
    if (disablePanZoom) return;
    if (isDragging) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y
      });
    }
  }, [disablePanZoom, isDragging, startDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = useCallback((e, delta, centerX, centerY) => {
    if (disablePanZoom) return;
    setZoom(prevZoom => {
      const newZoom = Math.max(
        canvasParams.minZoom,
        Math.min(canvasParams.maxZoom, prevZoom * (1 + delta * canvasParams.zoomFactor))
      );
      const newX = centerX - (centerX - position.x) * (newZoom / prevZoom);
      const newY = centerY - (centerY - position.y) * (newZoom / prevZoom);
      setPosition({ x: newX, y: newY });
      return newZoom;
    });
  }, [disablePanZoom, position, canvasParams]);

  const handleWheel = useCallback((e) => {
    if (disablePanZoom) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    handleZoom(e, delta, e.clientX, e.clientY);
  }, [disablePanZoom, handleZoom]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        cursor: disablePanZoom ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={onDoubleClick}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          top: 0,
          left: 0,
          willChange: 'transform',
        }}
      >
        {typeof children === 'function' ? children({ zoom }) : children}
      </div>
    </div>
  );
};

export default InfiniteCanvas;