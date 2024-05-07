
export const setDarkMode = (darkMode) => ({
    type: 'SET_DARK_MODE',
    payload: darkMode,
  });
  
export const setInitialSettings = (settings) => ({
type: 'SET_INITIAL_SETTINGS',
payload: settings,
});
  
export const initializeApp = () => ({
    type: 'INITIALIZE_APP',
})