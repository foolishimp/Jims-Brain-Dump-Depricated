import React from 'react';
import PropTypes from 'prop-types';

const EventStackDisplay = ({ eventLog, topOffset, eventLimit = 20 }) => {
  const { past, future } = eventLog;

  const renderEvents = (events) => {
    return events.slice(-eventLimit).map((event, index) => (
      <li key={index}>{`${event.target} - ${event.action}`}</li>
    ));
  };

  return (
    <div style={{
      position: 'fixed',
      top: `${topOffset}px`,
      left: '20px',
      width: '250px',
      maxHeight: `calc(100vh - ${topOffset + 20}px)`,
      overflowY: 'auto',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '15px',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      zIndex: 999,
      fontSize: '14px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#2c3e50' }}>Event Stack</h3>
      <div>
        <h4 style={{ marginBottom: '10px', color: '#3498db' }}>Undo Stack:</h4>
        <ul style={{ padding: '0 0 0 20px', margin: 0, color: '#34495e' }}>
          {renderEvents(past)}
        </ul>
      </div>
      <div style={{ marginTop: '15px' }}>
        <h4 style={{ marginBottom: '10px', color: '#2ecc71' }}>Redo Stack:</h4>
        <ul style={{ padding: '0 0 0 20px', margin: 0, color: '#34495e' }}>
          {renderEvents(future)}
        </ul>
      </div>
    </div>
  );
};

EventStackDisplay.propTypes = {
  eventLog: PropTypes.shape({
    past: PropTypes.array.isRequired,
    future: PropTypes.array.isRequired,
  }).isRequired,
  topOffset: PropTypes.number.isRequired,
  eventLimit: PropTypes.number,
};

export default EventStackDisplay;