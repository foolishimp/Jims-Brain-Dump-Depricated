export const exportDiagram = (postits, arrows) => {
    const diagramData = {
      postits: postits.map(({ id, x, y, text, color }) => ({ id, x, y, text, color })),
      arrows: arrows.map(({ id, startId, endId, startPosition, endPosition }) => 
        ({ id, startId, endId, startPosition, endPosition }))
    };
    
    const jsonString = JSON.stringify(diagramData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };