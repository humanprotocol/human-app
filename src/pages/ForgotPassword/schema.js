import * as Yup from 'yup';
import { errors } from '../../constants';

export const ResetPasswordValidationSchema = Yup.object().shape({
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
});
