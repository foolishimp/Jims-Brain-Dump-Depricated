export const importDiagram = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const diagramData = JSON.parse(event.target.result);
          if (diagramData && diagramData.postits && diagramData.arrows) {
            resolve(diagramData);
          } else {
            reject(new Error('Invalid diagram data structure'));
          }
        } catch (error) {
          reject(new Error('Failed to parse diagram data'));
        }
      };
  
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };