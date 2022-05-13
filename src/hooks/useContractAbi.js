import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import HMTokenABI from '../abi/HMTokenABI.json';
import notifier from '../service/notify.service';

export const useContractAbi = ({ walletAddress }) => {
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState();

  useEffect(() => {
    (async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const token = new ethers.Contract(walletAddress, HMTokenABI);
        const balanceBigNumber = await provider.getBalance(walletAddress);
        const tokenBalance = Number(balanceBigNumber);

        setContract(token);
        setBalance(tokenBalance);
      } catch (err) {
        notifier.error('Oops something going wrong');
      }
    })();
  }, []);

  return {
    balance,
    contract,
  };
};
