import * as Yup from 'yup';
import { errors } from '../constants';

export const WithdrawSchema = Yup.object()
  .shape({
    walletAddr: Yup.string()
      .length(42, errors.errorMessage.invalidLengthWalletAddress)
      .required(errors.errorMessage.requireWalletAddress),
    amount: Yup.number(errors.errorMessage.invalidWithdrawAmount)
      .test('Positive', 'Amount should be greater than zero', (value) => value > 0)
      .required(errors.errorMessage.requiredWithdrawAmount),
    hcaptchaToken: Yup.string().required(
      'HCaptcha is not solved. Please, solve the captcha puzzle to withdraw HMT',
    ),
  })
  .required(errors.errorMessage.requiredWithdrawAmount);
