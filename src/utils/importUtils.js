// src/utils/importUtils.js

export const importDiagram = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] },
        }],
      });
      const file = await fileHandle.getFile();
      const content = await file.text();
      const diagramData = JSON.parse(content);
      return {
        filename: fileHandle.name.replace('.json', ''),
        data: diagramData
      };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load the file:', err);
        throw err;
      }
    }
  };
  
  export const loadAutoSavedDiagram = (filename, index) => {
    const autoSaveFilename = `auto-${filename}-${String(index).padStart(2, '0')}.json`;
    const autoSaveData = localStorage.getItem(autoSaveFilename);
    
    if (autoSaveData) {
      return JSON.parse(autoSaveData);
    }
    
    return null;
  };