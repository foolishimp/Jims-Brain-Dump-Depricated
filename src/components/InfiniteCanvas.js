import React, { useState, useCallback, useEffect, useRef } from 'react';
import useZoom from '../hooks/useZoom';

const InfiniteCanvas = ({
  children,
  onDoubleClick,
  disablePanZoom,
  zoomParams,
  topOffset = 0
}) => {
  const { zoom, position, handleZoom, handlePan } = useZoom(1, { x: 0, y: 0 }, zoomParams);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (disablePanZoom) return;
    if (e.button === 0) {
      setIsDragging(true);
      setStartDrag({ x: e.clientX, y: e.clientY });
    }
  }, [disablePanZoom]);

  const handleMouseMove = useCallback((e) => {
    if (disablePanZoom || !isDragging) return;
    const deltaX = e.clientX - startDrag.x;
    const deltaY = e.clientY - startDrag.y;
    handlePan(deltaX, deltaY);
    setStartDrag({ x: e.clientX, y: e.clientY });
  }, [disablePanZoom, isDragging, startDrag, handlePan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    if (disablePanZoom) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? 1 : -1;
    handleZoom(delta, offsetX, offsetY);
  }, [disablePanZoom, handleZoom]);

  const handleDoubleClick = useCallback((e) => {
    if (onDoubleClick) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      onDoubleClick(e, zoom, { x, y });
    }
  }, [onDoubleClick, zoom, position]);

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
        height: `calc(100vh - ${topOffset}px)`,
        marginTop: `${topOffset}px`,
        overflow: 'hidden',
        cursor: disablePanZoom ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
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