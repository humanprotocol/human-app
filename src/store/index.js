import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducer';

const composeEnhancers = composeWithDevTools({
  trace: true,
  traceLimit: 35,
});

export default function configureStore(initialState = {}) {
  const store = createStore(rootReducer, initialState, composeEnhancers());
  return store;
}
