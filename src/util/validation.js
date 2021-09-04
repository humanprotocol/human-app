import Joi from 'joi';
import { ErrorMessage } from '../constants';

const passwordValidator = (value, helper) => {
    if (value.length < 8) {
        return helper.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helper.message('password must contain at least 1 letter and 1 number');
    }
    return value;
}

const emailValidator = (value, helper) => {
    const pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!pattern.test(value)) return helper.message(ErrorMessage.invalidEmail);
    return value;
}

export const EmailSchema = Joi.string().custom(emailValidator).required().messages({
        'string.empty': ErrorMessage.requireEmail,
});
export const PasswordSchema = Joi.string().custom(passwordValidator).required();
export const UserNameSchema = Joi.string().required();
export const ReferalCodeSchema = Joi.string().optional();
export const CoutrySchema = Joi.string().required();


export const LoginSchema = Joi.object().keys({
    email: EmailSchema,
    password: Joi.string().required().messages({
        'string.empty': ErrorMessage.requirePassword,
    }),
}).required();

export const validate = (schema, object) => {
    const { value, error } = Joi.compile(schema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);
    
    if (error) {
        const errorMessage = error.details.map((details) => {
            return {
                key: details.context.key,
                message: details.message,
            }
        });

        return errorMessage;
    }
}