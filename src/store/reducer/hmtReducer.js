import * as TYPES from '../actionType';

var initValue = {
  htmCounts: 0,
};

const hmtReducer = (state = initValue, action) => {
  switch (action.type) {
    case TYPES.INCREASE_HMT_COUNT:
      return { ...state, htmCounts: state.htmCounts + action.payload };
    case TYPES.DECREASE_HMT_COUNT:
      return { ...state, htmCounts: state.htmCounts - action.payload > 0 ? state.htmCounts - action.payload : 0  };
    default:
      return { ...state };
  }
};

export default hmtReducer;
