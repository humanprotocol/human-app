import * as Yup from 'yup';
import { errors } from '../../constants';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(errors.errorMessage.invalidEmail)
    .required(errors.errorMessage.requireEmail),
  password: Yup.string().required(errors.errorMessage.requirePassword),
  token: Yup.string().required(errors.errorMessage.captchaPassRequired),
});
