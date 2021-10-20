import * as Yup from 'yup';
import { errors } from '../constants';

export const WithdrawSchema = Yup.object()
  .shape({
    walletAddr: Yup.string()
      .length(42, errors.errorMessage.invalidLengthWalletAddress)
      .required(errors.errorMessage.requireWalletAddress),
    // prettier-ignore
    amount: Yup.number(errors.errorMessage.invalidWithdrawAmount)
      .test('Positive', 'Amount should be greater than zero', (value) => value > 0)
      .required(errors.errorMessage.requiredWithdrawAmount),
  })
  .required(errors.errorMessage.requiredWithdrawAmount);
