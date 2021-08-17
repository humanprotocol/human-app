import jwt from 'jwt-decode';
import * as TYPES from '../actionType';
import { getMyAccount } from '../../service/user.service';
const token = localStorage.getItem('token');
let user = null;
if(token) {
  const jwtDoc = jwt
  getMyAccount(token)
  .then((response) => user = response)
  .catch((err) => user = null);
}

var initValue = {
  isAuthed: user ? true : false,
  user: user,
  token: token || null,
  refreshToken: null,
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
