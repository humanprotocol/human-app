import axios from 'axios';

export const sendWithdraw = async (amount, token) => {
  return axios
    .post(
      `${process.env.REACT_APP_API_URL}/withdrawal`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .then((response) => {
      if (response && response.data) {
        return response.data;
      }
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(err.response.data.message);
      } else throw new Error('Network Error');
    });
};

export const getWithdraws = async (status, token) => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/withdrawal`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { status },
    })
    .then((response) => {
      if (response && response.data) {
        return response.data;
      }
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(err.response.data.message);
      } else throw new Error('Network Error');
    });
};
