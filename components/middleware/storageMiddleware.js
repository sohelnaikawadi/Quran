import { loadSettings } from '../storage';
import { setInitialSettings } from '../actions/index';

const storageMiddleware = (store) => (next) => (action) => {
  if (action.type === 'INITIALIZE_APP') {
    const initialState = loadSettings();
    store.dispatch(setInitialSettings(initialState));
  }

  return next(action);
};

export default storageMiddleware;