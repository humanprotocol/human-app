import * as Yup from 'yup';
import { ErrorMessage } from '../utils/constants';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.requireEmail),
  password: Yup.string().required(ErrorMessage.requirePassword),
  token: Yup.string().required(ErrorMessage.captchaPassRequired),
});

export const EmailValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.requireEmail),
});

export const PasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength),
});

export const ResetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength),
  repeatPassword: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength)
    .when('password', {
      is: password => !!(password && password.length > 0),
      then: Yup.string().oneOf([Yup.ref('password')], ErrorMessage.notConfirmedPassword),
    }),
});

export const RegisterValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.requireEmail),
  password: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength),
  repeatPassword: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength)
    .when('password', {
      is: password => !!(password && password.length > 0),
      then: Yup.string().oneOf([Yup.ref('password')], ErrorMessage.notConfirmedPassword),
    }),
  userName: Yup.string().required(ErrorMessage.requireUserName),
  country: Yup.string().required(ErrorMessage.requireCountry),
  refCode: Yup.string().nullable(true),
  hcaptchaToken: Yup.string().required(ErrorMessage.captchaPassRequired),
});
