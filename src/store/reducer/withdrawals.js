import * as TYPES from '../action';

const initialState = {
  items: [],
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.SET_WITHDRAWALS:
      return { ...state, items: action.payload };
    default:
      return { ...state };
  }
};

export default authReducer;
