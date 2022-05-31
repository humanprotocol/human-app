import axios from 'axios';

export const verifyToken = (hcaptchaToken, authToken) => {
  return axios
    .post(
      `${window._env_.REACT_APP_API_URL}/v1/labeling/hcaptcha/verify`,
      {
        hcaptchaToken,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network Error');
      }
    });
};

export const connect = (authToken) => {
  return axios
    .post(`${window._env_.REACT_APP_API_URL}/v1/labeling/hcaptcha/enable`, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network Error');
      }
    });
};

export const getStats = (authToken) => {
  const endpoint = `${window._env_.REACT_APP_API_URL}/v1/labeling/hcaptcha/user-stats`;
  return axios
    .get(endpoint, { headers: { Authorization: `Bearer ${authToken}` } })
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Network Error');
      }
    });
};
