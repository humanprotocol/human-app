import * as Yup from 'yup';
import { ErrorMessage } from '../constants';

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(ErrorMessage.invalidEmail)
    .required(ErrorMessage.requireEmail),
  password: Yup.string().required(ErrorMessage.requirePassword),
  token: Yup.string().required(ErrorMessage.captchaPassRequired),
});
