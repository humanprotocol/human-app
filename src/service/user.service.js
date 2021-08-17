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
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register`,
    user,
  ).then((response) => {
    if(response) {
      const { user, tokens } = response.data;
      localStorage.setItem('token', tokens.access.token);
      localStorage.setItem('refreshToken', tokens.refresh.token);
      return { user, token: tokens.access.token };
    }
  }).catch((err) => {
    throw new Error(err.response.data.message);
  })
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

export const update = async (id, token, user) => {
  return axios.patch(
    `${process.env.REACT_APP_API_URL}/users/${id}`,
    user,
    { headers: { 
      Authorization: `Bearer ${token}`,
    } }
  ).then((response) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    if(response) {
      return response.data;
    }
  }).catch((err) => { console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err.response); throw new Error(err.response.data.message) });
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
    throw new Error(err.response.data.message)
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
  return true;
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/verify-email`,
    null,
    { params: { token }, headers: { Authorization: `Bearer ${token}`} }
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

export const resendEmailVerification = async (token) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/send-verification-email`,
    null,
    { headers: { Authorization: `Bearer ${token}` } }
  ).then((response) => {
    if(response && response.status === 204)
      return true;
    else throw new Error(`Failed to send email verification`);
  }).catch((err) => {
    throw new Error(err.response.data.message);
  });
}