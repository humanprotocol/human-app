import * as Yup from 'yup';
import { ErrorMessage } from '../constants';

export const WithdrawSchema = Yup.object()
  .shape({
    walletAddr: Yup.string()
      .length(42, ErrorMessage.invalidLengthWalletAddress)
      .required(ErrorMessage.requireWalletAddress),
    // prettier-ignore
    amount: Yup.number(ErrorMessage.invalidWithdrawAmount)
      .test('Positive', 'Amount should be greater than zero', (value) => value > 0)
      .required(ErrorMessage.requiredWithdrawAmount),
  })
  .required(ErrorMessage.requiredWithdrawAmount);
