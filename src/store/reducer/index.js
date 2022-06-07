import { combineReducers } from 'redux';
import AuthReducer from './auth';
import AppReducer from './app';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
});

export default rootReducer;
