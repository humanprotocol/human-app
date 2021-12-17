import { START_GLOBAL_LOADING, FINISH_GLOBAL_LOADING } from '../action';

const initialState = {
  isLoading: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_GLOBAL_LOADING:
      return { ...state, isLoading: true };
    case FINISH_GLOBAL_LOADING:
      return { ...state, isLoading: false };
    default:
      return { ...state };
  }
};

export default appReducer;
