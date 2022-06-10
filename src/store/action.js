// auth
export const AUTH_SIGN_IN = 'AUTH_SIGN_IN';
export const AUTH_SIGN_OUT = 'AUTH_SIGN_OUT';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const SET_USER = 'SET_USER';
export const INCREASE_HMT_COUNT = 'INCREASE_HMT_COUNT';
export const DECREASE_HMT_COUNT = 'DECREASE_HMT_COUNT';
export const SET_CAPTCHA_TOKEN = 'SET_CAPTCHA_TOKEN';
export const START_GLOBAL_LOADING = 'START_GLOBAL_LOADING';
export const FINISH_GLOBAL_LOADING = 'FINISH_GLOBAL_LOADING';

export const setUserDetails = (user) => ({
  type: SET_USER,
  payload: user,
});

export const signIn = () => ({
  type: AUTH_SIGN_IN,
  payload: true,
});

export const signOut = () => ({
  type: AUTH_SIGN_OUT,
  payload: false,
});

export const startGlobalLoading = () => ({
  type: START_GLOBAL_LOADING,
});

export const finishGlobalLoading = () => ({
  type: FINISH_GLOBAL_LOADING,
});
