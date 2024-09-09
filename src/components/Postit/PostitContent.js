import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { parseMarkdown } from '../../utils/postit';
import styles from '../../styles/Postit.module.css';

const PostitContent = ({ postit, updatePostit, onStopEditing }) => {
  const textareaRef = useRef(null);

  const handleTextChange = useCallback((event) => {
    updatePostit({ text: event.target.value });
  }, [updatePostit]);

  const handleBlur = useCallback(() => {
    console.log(`Exiting edit mode for Postit ${postit.id}`);
    onStopEditing();
  }, [onStopEditing, postit.id]);

  useEffect(() => {
    if (postit.isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [postit.isEditing]);

  if (postit.isEditing) {
    return (
      <textarea
        ref={textareaRef}
        className={styles.postitTextarea}
        value={postit.text}
        onChange={handleTextChange}
        onBlur={handleBlur}
      />
    );
  }

  return (
    <div
      className={styles.postitContent}
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
  onStopEditing: PropTypes.func.isRequired,
};

export default React.memo(PostitContent);