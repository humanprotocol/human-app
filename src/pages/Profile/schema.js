import * as Yup from 'yup';
import { errors } from '../../constants';

export const ProfileValidationSchema = Yup.object()
  .shape({
    name: Yup.string().required(errors.errorMessage.requireUserName),
    email: Yup.string()
      .email(errors.errorMessage.invalidEmail)
      .required(errors.errorMessage.requireEmail),
    country: Yup.string().required(errors.errorMessage.requireCountry),
    polygonWalletAddr: Yup.string()
      .length(42, errors.errorMessage.invalidLengthWalletAddress)
      .required(errors.errorMessage.requireWalletAddress),
  })
  .required(errors.errorMessage.requireProfileDetails);
