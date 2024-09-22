import { Router } from 'express';

// import { addContactController, getAllContactsController, getContactsByIdController, upsertContactController } from "../controllers/contacts.js";
import * as contactControllers from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get(
  '/',
  ctrlWrapper(contactControllers.getAllContactsController),
);

contactsRouter.get(
  '/:id',
  ctrlWrapper(contactControllers.getContactsByIdController),
);

contactsRouter.post('/', ctrlWrapper(contactControllers.addContactController));

contactsRouter.put(
  '/:id',
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
