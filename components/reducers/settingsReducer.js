const initialState = {
    darkMode: false,
  };
  
  const settingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_INITIAL_SETTINGS':
        return action.payload;
      case 'SET_DARK_MODE':
        return {
          ...state,
          darkMode: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default settingsReducer;
  