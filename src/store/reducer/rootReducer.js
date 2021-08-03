import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import HMTReducer from './hmtReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  hmt: HMTReducer,
});

export default rootReducer;
