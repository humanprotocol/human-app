/* eslint-disable no-undef */
import axios from 'axios';
import * as EmailValidator from 'email-validator';
import { ErrorMessage } from '../constants';

export const authHeader = () => {
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const register = async (user) => {
  if (!user.name) throw new Error('name required');
  if (!user.password) throw new Error('password required');
  if (user.password.length < 5) throw new Error('password is at least 5 length');
  if (!user.email) throw new Error('email required');
  if (user.email && !EmailValidator.validate(user.email)) { throw new Error('Invalid email'); }
  const locationData = { registration: {} };
  const currentTime = new Date().getTime();
  try {
    const ipData = await axios.get('https://geolocation-db.com/json/');
    if (ipData.status === 200) {
      locationData.registration = ipData.data;
      locationData.registration.timestamp = currentTime;
    }
  } catch (e) {
    locationData.registration.error = 'Unable to get location data';
    locationData.registration.timestamp = currentTime;
  }
  user.misc = locationData;
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register`,
    user,
  ).then((response) => {
    if (response) {
      const { user, tokens } = response.data;
      localStorage.setItem('token', tokens.access.token);
      return { user, token: tokens.access.token, refreshToken: tokens.refresh.token };
    }
  }).catch((err) => {
    throw new Error(err.response.data.message);
  });
};

export const signIn = async ({ email, password, hcaptchaToken }) => {
  const currentTime = new Date().getTime();
  const locationData = { logins: {} };

  await axios.get('https://geolocation-db.com/json/')
    .then((ipData) => {
      if (ipData.status === 200) {
        locationData.logins[currentTime] = ipData.data;
      }
    }).catch((err) => {
      locationData.logins[currentTime] = { error: 'Unable to get location data' };
    });

  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    {
      email, password, misc: locationData, hcaptchaToken,
    },
  ).then((response) => {
    const { user, tokens } = response.data;
    localStorage.setItem('token', tokens.access.token);
    return { user, token: tokens.access.token, refreshToken: tokens.refresh.token };
  }).catch((err) => {
    if (err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
  });
};

export const update = async (id, token, user) => axios.patch(
  `${process.env.REACT_APP_API_URL}/users/${id}`,
  user,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
).then((response) => {
  if (response) {
    return response.data;
  }
}).catch((err) => {
  if (err.response) throw new Error(err.response.data.message);
  else throw new Error('Network Error');
});

export const logOut = async (token, refreshToken) => axios.post(
  `${process.env.REACT_APP_API_URL}/auth/logout`,
  { refreshToken },
  { headers: { Authorization: `Bearer ${token}` } },
).then((response) => {
  if (response && response.status === 204) {
    localStorage.removeItem('token');
    return true;
  }
  return false;
}).catch((err) => {
  if (err.response) throw new Error(err.response.data.message);
  else throw new Error('Network Error');
});

export const forgotPassword = async (email) => {
  if(!email) throw new Error(`email required`);

  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
    { email },
  ).catch((err) => {
    if(err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
  })
} 

export const resetPassword = async(password, token) => {
  if(!password) throw new Error(ErrorMessage.requirePassword);
  if(!token) throw new Error(ErrorMessage.requireRestPasswordToken);

  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/reset-password`,
    { password },
    { params: { token } }
  ).catch((err) => {
    if(err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
  })
}

export const getMyAccount = async (id, token) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/users/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  ).then((response) => {
    if(response) return response.data;
    else return null;
  }).catch((err) => { 
    if(err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
  });
}

export const verifyEmail = async (token) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/verify-email`,
    null,
    { params: { token }}
  ).then((response) => {
    if(response && response.status === 204)
      return true;
    else throw new Error(`Failed to verify email`);
  }).catch((err) => { 
    if(err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
  });
}

export const sendNewsletterSignup = async (data) => {
  return axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register-interest`,
    data,
  ).then((response) => {
    if(response && response.status === 204)
      return true;
    else throw new Error(`Failed to send email verification`);
  }).catch((err) => {
    if(err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
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
    if(err.response) throw new Error(err.response.data.message);
    else throw new Error('Network Error');
  });
};

export const verifyEmail = async (token) => axios.post(
  `${process.env.REACT_APP_API_URL}/auth/verify-email`,
  null,
  { params: { token } },
).then((response) => {
  if (response && response.status === 204) { return true; }
  throw new Error('Failed to verify email');
}).catch((err) => {
  if (err.response) throw new Error(err.response.data.message);
  else throw new Error('Network Error');
});

export const sendNewsletterSignup = async (data) => axios.post(
  `${process.env.REACT_APP_API_URL}/auth/register-interest`,
  data,
).then((response) => {
  if (response && response.status === 204) { return true; }
  throw new Error('Failed to send email verification');
}).catch((err) => {
  if (err.response) throw new Error(err.response.data.message);
  else throw new Error('Network Error');
});

export const resendEmailVerification = async (token) => axios.post(
  `${process.env.REACT_APP_API_URL}/auth/send-verification-email`,
  null,
  { headers: { Authorization: `Bearer ${token}` } },
).then((response) => {
  if (response && response.status === 204) { return true; }
  throw new Error('Failed to send email verification');
}).catch((err) => {
  if (err.response) throw new Error(err.response.data.message);
  else throw new Error('Network Error');
});

export const updateMisc = async (id, token, questionnaire) => axios.post(
  `${process.env.REACT_APP_API_URL}/users/${id}/misc`,
  { questionnaire },
  { headers: { Authorization: `Bearer ${token}` } },
).then((response) => {
  if (response) {
    return response.data;
  }
}).catch((err) => {
  if (err.response) throw new Error(err.response.data.message);
  else throw new Error('Network Error');
});
