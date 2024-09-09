import React from 'react';
import PropTypes from 'prop-types';

const ColorMenu = ({ colors, onColorSelect, onClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        right: '0',
        top: '100%',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '5px',
        zIndex: 100,
      }}
    >
      {Object.entries(colors).map(([name, value]) => (
        <div
          key={name}
          style={{
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: value,
            margin: '2px 0',
            borderRadius: '2px',
          }}
          onClick={() => onColorSelect(value)}
        >
          {name}
        </div>
      ))}
    </div>
  );
};

ColorMenu.propTypes = {
  colors: PropTypes.object.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ColorMenu;