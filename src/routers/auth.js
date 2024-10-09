import { Router } from 'express';

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from '../utils/ctrlWrapper.js';

import validateBody from '../utils/validateBody.js';

import { userSignupSchema } from '../validation/users.js';


const authRouter = Router();

authRouter.post("/signup", validateBody(userSignupSchema), ctrlWrapper(authControllers.signupController));

export default authRouter;
