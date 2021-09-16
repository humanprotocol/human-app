import * as Yup from 'yup';
import { ErrorMessage } from '../constants';

export const ProfileValidationSchema = Yup.object().shape({
  name: Yup.string().required(ErrorMessage.requireUserName),
  email: Yup.string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.requireEmail),
  country: Yup.object(ErrorMessage.invalidCountry).shape({
    value: Yup.string(ErrorMessage.invalidCountryCode)
      .length(2, ErrorMessage.invalidCountryCode)
      .required(ErrorMessage.requireCountryCode),
    label: Yup.string().required(ErrorMessage.requireCountryLabel),
  }),
  walletAddress: Yup.string()
    .length(42, ErrorMessage.invalidLengthWalletAddress)
    .required(ErrorMessage.requireWalletAddress),
});
