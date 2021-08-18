import * as TYPES from '../actionType';
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');

var initValue = {
  isAuthed: false,
  user: null,
  token: token || null,
  refreshToken: refreshToken || null,
};

const authReducer = (state = initValue, action) => {
  switch (action.type) {
    case TYPES.AUTH_SIGN_IN:
      return { ...state, isAuthed: action.payload };
    case TYPES.AUTH_SIGN_OUT:
      return { ...state, isAuthed: action.payload, user: null, token: null, refreshToken: null };
    case TYPES.AUTH_SUCCESS:
      return { ...state, ...action.payload };
    case TYPES.SET_USER:
      return { ...state, user: action.payload };
    default:
      return { ...state };
  }
};

export default authReducer;
