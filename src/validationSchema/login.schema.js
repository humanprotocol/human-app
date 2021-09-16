import * as Yup from 'yup';
import { ErrorMessage } from '../constants';

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
    .min(8, ErrorMessage.invalidPasswordLength)
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/gm,
      ErrorMessage.invalidPassword,
    ),
});

export const ResetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength)
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/gm,
      ErrorMessage.invalidPassword,
    ),
  repeatPassword: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength)
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/gm,
      ErrorMessage.invalidPassword,
    )
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
    .min(8, ErrorMessage.invalidPasswordLength)
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/gm,
      ErrorMessage.invalidPassword,
    ),
  repeatPassword: Yup.string()
    .required(ErrorMessage.requirePassword)
    .min(8, ErrorMessage.invalidPasswordLength)
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/gm,
      ErrorMessage.invalidPassword,
    )
    .when('password', {
      is: password => !!(password && password.length > 0),
      then: Yup.string().oneOf([Yup.ref('password')], ErrorMessage.notConfirmedPassword),
    }),
  userName: Yup.string().required(ErrorMessage.requireUserName),
  country: Yup.string()
    .length(2, ErrorMessage.invalidCountryCode)
    .required(ErrorMessage.requireCountry),
  refCode: Yup.string().nullable(true),
  hcaptchaToken: Yup.string().required(ErrorMessage.captchaPassRequired),
});
