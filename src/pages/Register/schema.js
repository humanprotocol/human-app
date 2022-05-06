import * as Yup from 'yup';
import { errors } from '../../constants';

export const RegisterValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(errors.errorMessage.invalidEmail)
    .required(errors.errorMessage.requireEmail),
  password: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      errors.errorMessage.weakPassword,
    ),
  repeatPassword: Yup.string()
    .required(errors.errorMessage.requirePassword)
    .when('password', {
      is: (password) => !!(password && password.length > 0),
      then: Yup.string().oneOf([Yup.ref('password')], errors.errorMessage.notConfirmedPassword),
    }),
  userName: Yup.string().required(errors.errorMessage.requireUserName),
  country: Yup.string().required(errors.errorMessage.requireCountry),
  hcaptchaToken: Yup.string().required(errors.errorMessage.captchaPassRequired),
  areTermsAndConditionsAccepted: Yup.boolean()
    .required(errors.errorMessage.tcRequired)
    .oneOf([true], errors.errorMessage.tcRequired),
});
