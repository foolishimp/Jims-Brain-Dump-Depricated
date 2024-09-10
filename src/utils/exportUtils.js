// src/utils/exportUtils.js
import { v4 as uuidv4 } from 'uuid';

let lastSaveHandle = null;

export const exportDiagram = async (postits, arrows, filename) => {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `${filename}.json`,
      types: [{
        description: 'JSON Files',
        accept: { 'application/json': ['.json'] },
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify({ postits, arrows }, null, 2));
    await writable.close();
    lastSaveHandle = handle;
    return handle.name.replace('.json', '');
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Failed to save the file:', err);
      throw err;
    }
  }
};

export const autoSaveDiagram = async (postits, arrows, filename, autoSaveIndex) => {
  const autoSaveFilename = `auto-${filename}-${String(autoSaveIndex).padStart(2, '0')}.json`;
  const diagramData = JSON.stringify({ postits, arrows }, null, 2);

  try {
    if (lastSaveHandle) {
      // If we have a last save location, save there
      const autoSaveHandle = await lastSaveHandle.getDirectoryHandle();
      const fileHandle = await autoSaveHandle.getFileHandle(autoSaveFilename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(diagramData);
      await writable.close();
    } else {
      // If no last save location, save to downloads
      const blob = new Blob([diagramData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = autoSaveFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    console.log(`Auto-saved: ${autoSaveFilename}`);
    return (autoSaveIndex + 1) % 10;
  } catch (err) {
    console.error('Failed to auto-save the file:', err);
    // If auto-save fails, generate a unique filename and try again
    const uniqueFilename = `auto-${uuidv4().substring(0, 6)}.json`;
    const blob = new Blob([diagramData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = uniqueFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`Auto-saved with unique filename: ${uniqueFilename}`);
    return (autoSaveIndex + 1) % 10;
  }
};