import { Router } from 'express';

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from '../utils/ctrlWrapper.js';

import validateBody from '../utils/validateBody.js';

import {
  userRegisterSchema,
  userLoginSchema,  
  requestResetEmailSchema,
} from '../validation/users.js';

import { requestResetEmailController } from '../controllers/auth.js';

const authRouter = Router();
// регістрація нового юзера
authRouter.post("/register", validateBody(userRegisterSchema), ctrlWrapper(authControllers.registerController));
// логін наявного юзера
authRouter.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(authControllers.loginController),
);
// оновлення токена доступу
authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));
// вихід юзера
authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

export default authRouter;
