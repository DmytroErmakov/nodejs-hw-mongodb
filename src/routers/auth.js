import { Router } from 'express';

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from '../utils/ctrlWrapper.js';

import validateBody from '../utils/validateBody.js';

import { userRegisterSchema, userLoginSchema } from '../validation/users.js';


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

export default authRouter;
