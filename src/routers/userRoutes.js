import { Router } from 'express';
import { createUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/add-user', createUser);

export default userRouter;
