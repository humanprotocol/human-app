import * as TYPES from '../actionType';

const initialState = {
  servedCaptchas: 0,
  solvedCaptchas: 0,
};

const userStatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPES.DATA_LABEL_CAPTCHA_SOLVED:
      return {
        ...state,
        servedCaptchas: action.payload.servedCaptchas,
        solvedCaptchas: action.payload.solvedCaptchas,
      };
    default:
      return state;
  }
};

export default userStatsReducer;
