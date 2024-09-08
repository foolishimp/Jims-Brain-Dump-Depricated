import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { parseMarkdown } from '../../utils/postit';
import styles from '../../styles/Postit.module.css';

const PostitContent = ({ postit, updatePostit, onDoubleClick }) => {
  const handleTextChange = useCallback((event) => {
    updatePostit({ text: event.target.value });
  }, [updatePostit]);

  const handleBlur = useCallback(() => {
    updatePostit({ isEditing: false });
  }, [updatePostit]);

  if (postit.isEditing) {
    return (
      <textarea
        className={styles.postitTextarea}
        value={postit.text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }

  return (
    <div
      className={styles.postitContent}
      onDoubleClick={onDoubleClick}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(postit.text) }}
    />
  );
};

PostitContent.propTypes = {
  postit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
  }).isRequired,
  updatePostit: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

export default React.memo(PostitContent);