import React, { useCallback } from 'react';
import { parseMarkdown } from '../utils/postit';

const PostitContent = ({ text, isEditing, onChange, onStartEditing, onStopEditing, zoom }) => {
  const handleDoubleClick = useCallback((event) => {
    event.stopPropagation();
    onStartEditing();
  }, [onStartEditing]);

  const handleChange = useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  const fontSize = zoom >= 1 ? 16 : zoom >= 0.5 ? 14 : zoom >= 0.25 ? 12 : zoom >= 0.1 ? 10 : 8;

  if (isEditing) {
    return (
      <textarea
        value={text}
        onChange={handleChange}
        onBlur={onStopEditing}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          resize: 'none',
          backgroundColor: 'transparent',
          fontSize: `${fontSize}px`,
        }}
        autoFocus
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
      style={{
        width: '100%',
        height: '100%',
        padding: '10px',
        fontSize: `${fontSize}px`,
      }}
    />
  );
};

export default PostitContent;