import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import HMTReducer from './hmtReducer';
import UserStatsReducer from './userStatsReducer';

const rootReducer = combineReducers({
  auth: AuthReducer,
  hmt: HMTReducer,
  userStats: UserStatsReducer,
});

export default rootReducer;
