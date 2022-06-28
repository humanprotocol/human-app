import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { config } from '../config';
import HMTokenABI from '../artifacts/HMTokenABI.json';
import notifier from '../service/notify.service';

const providerUrl = config.polygonMainnet;
const tokenAddr = config.hmtTokenContractAddress;

export const useContractAbi = ({ walletAddr }) => {
  const [balance, setBalance] = useState('0');
  useEffect(() => {
    if (!walletAddr) return;
    (async () => {
      try {
        const Web3Client = new Web3(providerUrl);
        const contract = new Web3Client.eth.Contract(HMTokenABI, tokenAddr);
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
