import jwt from 'jwt-decode';
import * as TYPES from '../actionType';
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
var initValue = {
  isAuthed: user ? true : false,
  user: user ? JSON.parse(user) : null,
  // user: user ? jwt(user) : null,
};

const authReducer = (state = initValue, action) => {
  switch (action.type) {
    case TYPES.AUTH_SIGN_IN:
      return { ...state, isAuthed: action.payload };
    case TYPES.AUTH_SIGN_OUT:
      return { ...state, isAuthed: action.payload, user: null };
    case TYPES.AUTH_SUCCESS:
      return { ...state, user: action.payload };
    default:
      return { ...state };
  }
};

export default authReducer;
