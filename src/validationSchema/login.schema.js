import * as Yup from 'yup';
import { errors } from '../constants';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(errors.errorMessage.invalidEmail)
    .required(errors.errorMessage.requireEmail),
  password: Yup.string().required(errors.errorMessage.requirePassword),
  token: Yup.string().required(errors.errorMessage.captchaPassRequired),
});

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

export const ResetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .min(8, errors.errorMessage.invalidPasswordLength),
  repeatPassword: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .min(8, errors.errorMessage.invalidPasswordLength)
    .when('password', {
      is: (password) => !!(password && password.length > 0),
      then: Yup.string().oneOf([Yup.ref('password')], errors.errorMessage.notConfirmedPassword),
    }),
});

export const RegisterValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(errors.errorMessage.invalidEmail)
    .required(errors.errorMessage.requireEmail),
  password: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .min(8, errors.errorMessage.invalidPasswordLength),
  repeatPassword: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .min(8, errors.errorMessage.invalidPasswordLength)
    .when('password', {
      is: (password) => !!(password && password.length > 0),
      then: Yup.string().oneOf([Yup.ref('password')], errors.errorMessage.notConfirmedPassword),
    }),
  userName: Yup.string().required(errors.errorMessage.requireUserName),
  country: Yup.string().required(errors.errorMessage.requireCountry),
  refCode: Yup.string().nullable(true),
  hcaptchaToken: Yup.string().required(errors.errorMessage.captchaPassRequired),
});
