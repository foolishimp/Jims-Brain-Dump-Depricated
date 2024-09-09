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
      {Object.entries(colors).map(([name, shades]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            margin: '2px 0',
          }}
        >
          {shades.map((shade, index) => (
            <div
              key={index}
              style={{
                width: '50px', // Maintain current width, split into two
                height: '20px',
                backgroundColor: shade,
                cursor: 'pointer',
                borderRadius: index === 0 ? '2px 0 0 2px' : '0 2px 2px 0',
              }}
              onClick={() => onColorSelect(shade)}
              title={`${name} (${index === 0 ? 'light' : 'dark'})`}
            />
          ))}
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