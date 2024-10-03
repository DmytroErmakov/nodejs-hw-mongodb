import Joi from 'joi';

import {
  contactTypeList,
  phoneNumberRegexp,
  emailRegexp,
} from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp).required().messages({
    'string.base': 'Phone number should be a string',
    'string.pattern.base': 'Please provide a valid phone number',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'Email should be a string',
    'string.pattern.base': 'Please fill a valid email address',
    'any.required': 'Email is required',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .required()
    .messages({
      'string.base': 'Contact type should be a string',
      'any.required': 'Contact type is required',
      'any.allowOnly': `Contact type must be one of: ${contactTypeList.join(
        ', ',
      )}`,
    }),
});

export const contactPatchSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be at most 20 characters',
  }),
  phoneNumber: Joi.string().pattern(phoneNumberRegexp).messages({
    'string.base': 'Phone number should be a string',
    'string.pattern.base': 'Please provide a valid phone number',
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    'string.base': 'Email should be a string',
    'string.pattern.base': 'Please fill a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .messages({
      'string.base': 'Contact type should be a string',
    }),
});
