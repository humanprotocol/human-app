import * as Yup from 'yup';
import { errors, exchanges } from '../constants';

export const ProfileValidationSchema = Yup.object()
  .shape({
    name: Yup.string().required(errors.errorMessage.requireUserName),
    email: Yup.string()
      .email(errors.errorMessage.invalidEmail)
      .required(errors.errorMessage.requireEmail),
    country: Yup.string().required(errors.errorMessage.requireCountry),
    walletAddr: Yup.string()
      .length(42, errors.errorMessage.invalidLengthWalletAddress)
      .required(errors.errorMessage.requireWalletAddress),
    walletExchange: Yup.mixed()
      .oneOf(exchanges.availableExchanges)
      .required('Exchange is required'),
  })
  .required(errors.errorMessage.requireProfileDetails);
