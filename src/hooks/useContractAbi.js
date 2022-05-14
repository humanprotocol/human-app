import { useEffect, useState } from 'react';
import Web3 from 'web3';
import HMTokenABI from '../abi/HMTokenABI.json';
import notifier from '../service/notify.service';

const PROVIDER_URL = 'https://polygon-mainnet.infura.io/v3/8bf66d194c344a65adc7018e25646061';
const HUMAN_HMT_TOKEN_CONTRACT_ADDRESS = '0x444c45937D2202118a0FF9c48d491cef527b59dF';

export const useContractAbi = ({ walletAddr }) => {
  const [balance, setBalance] = useState();

  useEffect(() => {
    (async () => {
      try {
        const Web3Client = new Web3(PROVIDER_URL);
        const contract = new Web3Client.eth.Contract(HMTokenABI, HUMAN_HMT_TOKEN_CONTRACT_ADDRESS);
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
