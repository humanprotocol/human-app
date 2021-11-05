import axios from 'axios';

export const verifyHcaptchaToken = async (hcaptchaToken, authToken) => {
  if (!hcaptchaToken) throw new Error(`hcaptchaToken required`);
  if (!authToken) throw new Error(`authToken required`);

  return axios
    .post(
      `${process.env.REACT_APP_API_URL}/hcaptcha/verify`,
      { hcaptchaToken },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
    .then((response) => {
      return {
        servedCaptchas: response.data.servedCaptchas,
        solvedCaptchas: response.data.solvedCaptchas,
      };
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};

export const getUserStats = async (authToken) => {
  if (!authToken) throw new Error(`authToken required`);

  return axios
    .get(`${process.env.REACT_APP_API_URL}/hcaptcha/user-stats`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => {
      const { servedCaptchas, solvedCaptchas } = response.data;
      return { servedCaptchas, solvedCaptchas };
    })
    .catch((err) => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};
