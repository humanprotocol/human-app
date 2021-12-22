import { combineReducers } from 'redux';
import AuthReducer from './auth';
import AppReducer from './app';
import WithdrawalReducer from './withdrawals';

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  withdrawal: WithdrawalReducer,
});

export default rootReducer;
