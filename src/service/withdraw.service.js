import axios from 'axios';
import { http } from '../constants';

export const sendWithdraw = async (amount, hcaptchaToken, token) => {
  return axios
    .post(
      `${window._env_.REACT_APP_API_URL}/v1/withdrawal`,
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
    .get(`${window._env_.REACT_APP_API_URL}/v1/withdrawal`, {
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

export const execute = async (
  maxGasPriceGwei,
  exactGasPriceGwei,
  maxGasLimit,
  withdrawalsLimit,
  token,
) => {
  const body = {
    withdrawRecipientsLimit: withdrawalsLimit,
    maxGasLimit,
    maxGasPriceGwei,
    exactGasPriceGwei,
  };
  return axios
    .post(`${window._env_.REACT_APP_API_URL}/v1/withdrawal/execute`, body, {
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

export const updateWithdrawal = async (token, id, newStatus) => {
  return axios
    .patch(
      `${window._env_.REACT_APP_API_URL}/v1/withdrawal/${id}`,
      { newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
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

export const reactToWithdrawal = async (token, id, txHash) => {
  return axios
    .post(
      `${window._env_.REACT_APP_API_URL}/v1/withdrawal/react/${id}`,
      { txHash },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
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
