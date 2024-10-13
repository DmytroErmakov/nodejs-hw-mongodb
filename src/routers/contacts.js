import { Router } from 'express';

// import { addContactController, getAllContactsController, getContactsByIdController, upsertContactController } from "../controllers/contacts.js";
import * as contactControllers from '../controllers/contacts.js';

import authenticate from '../middlewares/authenticate.js';

import isValidId from '../middlewares/isValidId.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

import validateBody from '../utils/validateBody.js';

import { contactAddSchema, contactPatchSchema } from '../validation/contacts.js';

const contactsRouter = Router();
// Аутентифікація всіх маршрутів
contactsRouter.use(authenticate);
// отримання всіх контактів
contactsRouter.get(
  '/',
  ctrlWrapper(contactControllers.getAllContactsController),
);
// отримання контакта по ІД
contactsRouter.get(
  '/:id', isValidId,
  ctrlWrapper(contactControllers.getContactsByIdController),
);
//  додавання нового контакта
contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.addContactController),
);
// коригування контакта
contactsRouter.put(
  '/:id', isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.upsertContactController),
);
// оновлення контакта
contactsRouter.patch(
  '/:id',
  isValidId, validateBody(contactPatchSchema),
  ctrlWrapper(contactControllers.patchContactController),
);
// видалення контакта
contactsRouter.delete(
  '/:id', isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
