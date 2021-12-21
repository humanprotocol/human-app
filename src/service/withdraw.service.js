import axios from 'axios';
import { http } from '../constants';

export const sendWithdraw = async (amount, hcaptchaToken, token) => {
  return axios
    .post(
      `${process.env.REACT_APP_API_URL}/withdrawal`,
      { amount, hcaptchaToken },
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

export const getWithdrawals = async (token) => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/withdrawal`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      if (response.status === http.httpStatus.NO_CONTENT) return [];
      if (response && response.data) {
        return response.data.map((withdrawal) => ({
          id: withdrawal.id,
          status: withdrawal.status,
          createdAt: new Date(withdrawal.createdAt),
          network: withdrawal.network,
          txId: withdrawal.txId,
          amount: withdrawal.amount,
          walletAddr: withdrawal.walletAddr,
        }));
      }
    })
    .catch((err) => {
      if (err.response) {
        throw new Error(err.response.data.message);
      } else throw new Error('Network Error');
    });
};

export const execute = async (maxGasPriceGwei, maxGasLimit, withdrawalsLimit, token) => {
  const body = {
    withdrawRecipientsLimit: withdrawalsLimit,
    maxGasLimit,
    maxGasPriceGwei,
  };
  return axios
    .post(`${process.env.REACT_APP_API_URL}/withdrawal/execute`, body, {
      headers: { Authorization: `Bearer ${token}` },
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
