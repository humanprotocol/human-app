import axios from 'axios';
import * as EmailValidator from 'email-validator';
import { errors } from '../constants';

export const register = async (user) => {
  if (!user.name) throw new Error('name required');
  if (!user.password) throw new Error('password required');
  if (user.password.length < 5) throw new Error('password is at least 5 length');
  if (!user.email) throw new Error('email required');
  if (!user.areTermsAndConditionsAccepted)
    throw new Error('Terms and conditions should be accepted');
  if (user.email && !EmailValidator.validate(user.email)) {
    throw new Error('Invalid email');
  }

  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/register`, { ...user })
    .then((response) => {
      if (response) {
        const { tokens } = response.data;
        localStorage.setItem('token', tokens.access.token);
        localStorage.setItem('refreshToken', tokens.refresh.token);
        return {
          user: response.data.user,
          token: tokens.access.token,
          refreshToken: tokens.refresh.token,
        };
      }
    })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const signIn = async ({ email, password, hcaptchaToken }) => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/login`, {
      email,
      password,
      hcaptchaToken,
    })
    .then((response) => {
      const { user, tokens } = response.data;
      localStorage.setItem('token', tokens.access.token);
      localStorage.setItem('refreshToken', tokens.refresh.token);
      return { user, token: tokens.access.token, refreshToken: tokens.refresh.token };
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};

export const update = async (id, token, user) =>
  axios
    .patch(`${process.env.REACT_APP_API_URL}/v1/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response) {
        return response.data;
      }
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });

export const logOut = async (token, refreshToken) =>
  axios
    .post(
      `${process.env.REACT_APP_API_URL}/v1/auth/logout`,
      { refreshToken },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .then((response) => {
      if (response && response.status === 204) {
        localStorage.removeItem('token');
        return true;
      }
      return false;
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });

export const forgotPassword = async (email) => {
  if (!email) throw new Error('email required');

  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/forgot-password`, { email })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};

export const resetPassword = async (password, token) => {
  if (!password) throw new Error(errors.errorMessage.requirePassword);
  if (!token) throw new Error(errors.errorMessage.requireRestPasswordToken);

  return axios
    .post(
      `${process.env.REACT_APP_API_URL}/v1/auth/reset-password`,
      { password },
      { params: { token } },
    )
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};

export const getMyAccount = async (id, token) =>
  axios
    .get(`${process.env.REACT_APP_API_URL}/v1/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response) return response.data;
      return null;
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });

export const verifyEmail = async (token) =>
  axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/verify-email`, null, { params: { token } })
    .then((response) => {
      if (response && response.status === 204) {
        return true;
      }
      throw new Error('Failed to verify email');
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });

export const sendNewsletterSignup = async (data) =>
  axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/register-interest`, data)
    .then((response) => {
      if (response && response.status === 204) {
        return true;
      }
      throw new Error('Failed to send email verification');
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });

export const resendEmailVerification = async (token) =>
  axios
    .post(`${process.env.REACT_APP_API_URL}/v1/auth/send-verification-email`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response && response.status === 204) {
        return true;
      }
      throw new Error('Failed to send email verification');
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });

export const setQuestionnaire = async (
  id,
  taskQuestion,
  tasks,
  referQuestion,
  referPlace,
  token,
) => {
  const body = {
    questionnaire: [
      {
        q: taskQuestion,
        a: tasks,
      },
      {
        q: referQuestion,
        a: referPlace,
      },
    ],
  };
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/users/${id}/misc`, body, headers)
    .then((response) => response?.data)
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};

export const postVeriffSessionId = async ({ veriffUserId, token }) => {
  const body = {
    veriffUserId,
  };

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/users/kyc/started`, body, headers)
    .then((response) => response?.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const suspendUsers = async (userEmails, suspendStatus, authToken) => {
  const emails = userEmails.split(',').map((item) => item.trim());
  const body = {
    userEmails: emails,
    suspendStatus,
  };
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/users/suspend`, body, options)
    .then((response) => {
      if (response) {
        return {
          suspendStatus: response.data.suspendStatus,
        };
      }
    })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const unsuspendUsers = async (userEmails, authToken) => {
  const emails = userEmails.split(',').map((item) => item.trim());
  const body = {
    userEmails: emails,
  };
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/users/unsuspend`, body, options)
    .then((response) => {
      if (response && response.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};

export const deleteUsersByEmail = async (userEmails, authToken) => {
  const emails = userEmails.split(',').map((item) => item.trim());
  const body = {
    emails,
  };
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  return axios
    .post(`${process.env.REACT_APP_API_URL}/v1/users/delete/emails`, body, options)
    .then((response) => {
      if (response && response.status === 200) {
        return {
          message: 'Users has been deleted',
          failedUsers: response.data.failedUsers,
        };
      }
    })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
};
