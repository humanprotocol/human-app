import axios from 'axios';
import * as EmailValidator from 'email-validator';

export const authHeader = () => {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
      return { 'Authorization': 'Bearer ' + user.token };
  } else {
      return {};
  }

}

export const register = async (user) => {
  if(!user.name) throw new Error(`name required`);
  if(!user.password) throw new Error(`password required`);
  if(user.password.length < 5 ) throw new Error(`password is at least 5 length`);
  if(!user.email) throw new Error(`email required`);
  if(user.email && !EmailValidator.validate(user.email))
    throw new Error(`Invalid email`);

  return {
    "user": {
      "id": "5ebac534954b54139806c112",
      "email": "fake@example.com",
      "name": "fake name",
      "role": "user",
      "kyc": false,
      "referralCode": "Xt13",
      "walletAddr": "0x00000000000000011020000000000000022333",
      "earnedTokens": 4,
      "pendingTokens": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg"
  }
  
  // return axios.post(
  //   `${process.env.REACT_APP_API_URL}/auth/register`,
  //   user,
  // ).then((response) => {
  //   if(response) {
  //     const { user, tokens } = response.data;
  //     localStorage.setItem('token', tokens.access.token);
  //     localStorage.setItem('refreshToken', tokens.refresh.token);
  //     return { user, token: tokens.access.token };
  //   }
  // })
}

export const signIn = async ({email, password}) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    { email, password },
  ).then((response) => {
    const { user, tokens } = response.data;
    localStorage.setItem('token', tokens.access.token);
    localStorage.setItem('refreshToken', tokens.refresh.token);
    return { user, token: tokens.access.token };
  }).catch((err) => {
    throw new Error(err.response.data.message);
  });
}

export const update = async (user) => {
  localStorage.setItem('user', JSON.stringify(user));  
  return user;
}

export const logOut = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if(refreshToken && refreshToken.length) {
    return axios.post(
      `${process.env.REACT_APP_API_URL}/auth/logout`,
      { refreshToken },
    );
  } else {
    throw new Error('refreshToken required.')
  }
}

export const forgotPassword = async (email) => {
  if(!email) throw new Error(`email required`);
  if(email && EmailValidator.validate(email))
    throw new Error(`Invalid email`);

  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
    { email },
  ).catch((err) => {
    // throw new Error(err.response.data.)
  })
} 

export const linkWallet = async (address) => {
  // throw new Error(`Failed to link wallet`);
  return true;
}

export const getMyAccount = async (token) => {
  return {
    id: '5ebac534954b54139806c112',
    email: 'fake@example.com',
    name: 'fake name',
    role: 'user'
  }
}

export const verifyEmail = async (token) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/verify-email`,
    null,
    { params: { token } }
  ).then((response) => {
    if(response && response.status === 204)
      return true;
    else throw new Error(`Failed to verify email`);
  }).catch((err) => { throw new Error(err.response.data.message) });
}

export const sendVerificationEmail = async (data) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register-interest`,
    data,
  ).then((response) => {
    if(response && response.status === 204)
      return true;
    else throw new Error(`Failed to send email verification`);
  }).catch((err) => {
    throw new Error(err.response.data.message);
  });
}