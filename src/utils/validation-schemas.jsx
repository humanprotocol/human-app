import * as Yup from 'yup';
import { errors } from '../constants';

export const EmailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(errors.errorMessage.invalidEmail)
    .required(errors.errorMessage.requireEmail),
});

export const PasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .min(8, errors.errorMessage.invalidPasswordLength),
});
