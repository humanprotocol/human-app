import * as Yup from 'yup';
import { errors } from '../../constants';

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
