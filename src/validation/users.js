import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const userSignupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(), // тут необхідно вказувати вимоги для пароля які символи використовувати
});

export const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(), // тут необхідно вказати вимоги для пароля які символи використовувати
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
