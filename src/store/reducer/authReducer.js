import * as TYPES from '../actionType';

var initValue = {
  isAuthed: false,
  user: null,
};

const authReducer = (state = initValue, action) => {
  switch (action.type) {
    case TYPES.AUTH_SIGN_IN:
      return { ...state, isAuthed: action.payload };
    case TYPES.AUTH_SIGN_OUT:
      return { ...state, isAuthed: action.payload };
    case TYPES.AUTH_SUCCESS:
      return { ...state, user: action.payload };
    default:
      return { ...state };
  }
};

export default authReducer;
