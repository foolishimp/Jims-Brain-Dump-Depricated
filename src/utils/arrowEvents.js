export const arrowEventHandlers = {
    undo: (event, state) => {
      switch (event.action) {
        case 'CREATE':
          return {
            ...state,
            arrows: state.arrows.filter(a => a.id !== event.data.id),
          };
        case 'DELETE':
          return {
            ...state,
            arrows: [...state.arrows, event.data],
          };
        default:
          return state;
      }
    },
    redo: (event, state) => {
      switch (event.action) {
        case 'CREATE':
          return {
            ...state,
            arrows: [...state.arrows, event.data],
          };
        case 'DELETE':
          return {
            ...state,
            arrows: state.arrows.filter(a => a.id !== event.data.id),
          };
        default:
          return state;
      }
    },
  };