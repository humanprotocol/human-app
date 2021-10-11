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
