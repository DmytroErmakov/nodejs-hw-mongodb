import Joi from 'joi';
import { emailRegexp } from '../constants/users.js';

export const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(), // тут необхідно вказувати вимоги для пароля які символи використовувати
});

export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(), // тут необхідно вказати вимоги для пароля які символи використовувати
});
