import { useEffect, useState } from 'react';
import Web3 from 'web3';
import HMTokenABI from '../../artifacts/HMTokenABI.json';
import notifier from '../service/notify.service';

const providerUrl = process.env.REACT_APP_POLYGON_MAINNET;
const tokenArrd = process.env.REACT_APP_HUMAN_HMT_TOKEN_CONTRACT_ADDRESS;

export const useContractAbi = ({ walletAddr }) => {
  const [balance, setBalance] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const Web3Client = new Web3(providerUrl);
        const contract = new Web3Client.eth.Contract(HMTokenABI, tokenArrd);
        const weiValue = await contract.methods.balanceOf(walletAddr).call();
        const tokenBalance = Web3Client.utils.fromWei(weiValue, 'ether');
        setBalance(tokenBalance);
      } catch (err) {
        notifier.error('Oops something went wrong');
      }
    })();
  }, []);

  return {
    balance,
  };
};
