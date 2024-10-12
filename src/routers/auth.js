import { Router } from 'express';

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from '../utils/ctrlWrapper.js';

import validateBody from '../utils/validateBody.js';

import {
  userSignupSchema,
  userSigninSchema,
  requestResetEmailSchema,
} from '../validation/users.js';

import { requestResetEmailController } from '../controllers/auth.js';


const authRouter = Router();

authRouter.post("/signup", validateBody(userSignupSchema), ctrlWrapper(authControllers.signupController));

authRouter.post(
  '/signin',
  validateBody(userSigninSchema),
  ctrlWrapper(authControllers.signinController)
);

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post('/signout', ctrlWrapper(authControllers.signoutController));

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);



export default authRouter;
