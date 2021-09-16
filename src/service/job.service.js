/* eslint-disable no-undef */
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
    .then(response => {
      const { userStat } = response.data;
      return userStat;
    })
    .catch(err => {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error('Network Error');
    });
};
