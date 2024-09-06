// utils/postit.js

export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  export const createNewPostit = (x, y) => {
    return {
      id: generateId(),
      x,
      y,
      text: '',
      isEditing: true,
    };
  };
  
  export const parseMarkdown = (text) => {
    // This is a simple markdown parser. For a more robust solution, consider using a library like marked.
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };