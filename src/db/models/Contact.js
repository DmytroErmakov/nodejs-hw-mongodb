import { Schema, model } from 'mongoose';

import {
  contactTypeList,
  emailRegexp,
  phoneNumberRegexp,
} from '../../constants/contacts.js';
import { handleSaveError, setUpdateOptions } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [20, 'Name must be at most 20 characters'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: [3, 'Phone number must be at least 3 characters'],
      maxlength: [15, 'Phone number must be at most 15 characters'],
      match: phoneNumberRegexp,
    },
    email: {
      type: String,
      required: false,
      minlength: [3, 'Email must be at least 3 characters'],
      maxlength: [50, 'Email must be at most 50 characters'],
      match: emailRegexp,
      unique: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      default: 'personal',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

// Хуки це для запитів до бази
contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateOptions);

contactSchema.post('findOneAndUpdate', handleSaveError);

const ContactCollection = model('contact', contactSchema);

export const sortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

export default ContactCollection;
