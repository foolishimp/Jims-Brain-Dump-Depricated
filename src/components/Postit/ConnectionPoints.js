import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Postit.module.css';

const ConnectionPoints = ({ onStartConnection, width, height }) => {
  const [hoveredConnector, setHoveredConnector] = useState(null);

  const connectionPoints = [
    { x: width / 2, y: 0, position: 'top' },
    { x: width, y: height / 2, position: 'right' },
    { x: width / 2, y: height, position: 'bottom' },
    { x: 0, y: height / 2, position: 'left' },
  ];

  return (
    <>
      {connectionPoints.map((point, index) => (
        <div
          key={index}
          className={`${styles.connectionPoint} ${hoveredConnector === index ? styles.hovered : ''}`}
          style={{
            left: `${point.x - 8}px`,
            top: `${point.y - 8}px`,
          }}
          onMouseEnter={() => setHoveredConnector(index)}
          onMouseLeave={() => setHoveredConnector(null)}
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnection(point.position);
          }}
        />
      ))}
    </>
  );
};

ConnectionPoints.propTypes = {
  onStartConnection: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default React.memo(ConnectionPoints);