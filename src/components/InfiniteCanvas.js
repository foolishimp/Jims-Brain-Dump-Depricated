import React, { useState, useCallback, useEffect, useRef } from 'react';
import useZoom from '../hooks/useZoom';

const InfiniteCanvas = ({
  children,
  onDoubleClick,
  disablePanZoom,
  zoomParams = {}
}) => {
  const { zoom, position, handleZoom, handlePan } = useZoom(1, { x: 0, y: 0 }, zoomParams);
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
    if (disablePanZoom || !isDragging) return;
    const deltaX = e.clientX - startDrag.x - position.x;
    const deltaY = e.clientY - startDrag.y - position.y;
    handlePan(deltaX, deltaY);
  }, [disablePanZoom, isDragging, startDrag, position, handlePan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    if (disablePanZoom) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    handleZoom(delta, e.clientX, e.clientY);
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
        {typeof children === 'function' ? children({ zoom, position }) : children}
      </div>
    </div>
  );
};

export default InfiniteCanvas;