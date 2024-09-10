import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

const Arrow = ({ id, startX, startY, endX, endY, color = '#0077ff', zoom = 1, isSelected, onClick, isTemporary = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  const arrowHeadSize = 10 / zoom;
  const strokeWidth = (isSelected ? 4 : 2) / zoom;
  const clickAreaWidth = 10 / zoom; // Width of clickable area

  const handleClick = useCallback((event) => {
    if (!isTemporary && onClick) {
      event.stopPropagation();
      onClick(id);
    }
  }, [onClick, id, isTemporary]);

  const handleMouseEnter = () => !isTemporary && setIsHovered(true);
  const handleMouseLeave = () => !isTemporary && setIsHovered(false);

  return (
    <svg
      style={{
        position: 'absolute',
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${Math.abs(dx)}px`,
        height: `${Math.abs(dy)}px`,
        overflow: 'visible',
        pointerEvents: isTemporary ? 'none' : 'auto',
        zIndex: isTemporary ? 1000 : 'auto',
      }}
    >
      <g transform={`rotate(${angle} 0 0)`}>
        {/* Main arrow line */}
        <line
          x1="0"
          y1="0"
          x2={length - arrowHeadSize}
          y2="0"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        
        {/* Arrow head */}
        <polygon
          points={`${length-arrowHeadSize},-${arrowHeadSize/2} ${length},0 ${length-arrowHeadSize},${arrowHeadSize/2}`}
          fill={color}
        />
        
        {/* Hover effect */}
        {!isTemporary && isHovered && (
          <line
            x1="0"
            y1="0"
            x2={length}
            y2="0"
            stroke={color}
            strokeWidth={clickAreaWidth}
            opacity={0.3}
          />
        )}
        
        {/* Invisible, wider line for easier clicking */}
        {!isTemporary && (
          <line
            x1="0"
            y1="0"
            x2={length}
            y2="0"
            stroke="transparent"
            strokeWidth={clickAreaWidth}
            style={{ cursor: 'pointer' }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </g>
    </svg>
  );
};

Arrow.propTypes = {
  id: PropTypes.string,
  startX: PropTypes.number.isRequired,
  startY: PropTypes.number.isRequired,
  endX: PropTypes.number.isRequired,
  endY: PropTypes.number.isRequired,
  color: PropTypes.string,
  zoom: PropTypes.number,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  isTemporary: PropTypes.bool,
};

export default React.memo(Arrow);