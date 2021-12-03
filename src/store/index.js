import { createStore } from 'redux';
import rootReducer from './reducer';

export default function configureStore(initialState = {}) {
  const store = createStore(rootReducer, initialState);
  return store;
}
