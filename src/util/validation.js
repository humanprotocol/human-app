import Joi from 'joi';
import { ErrorMessage, JobOptions } from '../constants';

const passwordValidator = (value, helper) => {
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helper.message(ErrorMessage.invalidPassword);
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
export const PasswordSchema = Joi.string().custom(passwordValidator).min(8).required().messages({
    'string.empty': ErrorMessage.requirePassword,
    'string.min': ErrorMessage.invalidPasswordLength,
});
export const UserNameSchema = Joi.string().required().messages({
    'string.empty': ErrorMessage.requireUserName,
});
export const ReferalCodeSchema = Joi.string().optional();
export const CoutrySchema = Joi.string().required();


export const LoginSchema = Joi.object().keys({
    email: EmailSchema,
    password: Joi.string().required().messages({
        'string.empty': ErrorMessage.requirePassword,
    }),
}).required();

export const RegisterSchema = Joi.object().keys({
    email: EmailSchema,
    userName: UserNameSchema,
    password: PasswordSchema,
    repeatPassword: PasswordSchema.valid(Joi.ref('password')).messages({
        'any.only': ErrorMessage.notConfirmedPassword
    }),
    country: Joi.object().keys({
        value: Joi.string().required(),
        label: Joi.string().required()
    }).required().messages({
        'object.base': ErrorMessage.requireCountry,
    }),
    refCode: Joi.string().allow(''),
});

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