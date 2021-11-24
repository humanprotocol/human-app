import { combineReducers } from 'redux';
import AuthReducer from './auth';
import HMTReducer from './hmt';

const rootReducer = combineReducers({
  auth: AuthReducer,
  hmt: HMTReducer,
});

export default rootReducer;
