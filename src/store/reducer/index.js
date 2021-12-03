import { combineReducers } from 'redux';
import AuthReducer from './auth';

const rootReducer = combineReducers({
  auth: AuthReducer,
});

export default rootReducer;
