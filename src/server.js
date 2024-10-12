import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { env } from './utils/env.js';

// імпортуємо винесені midleware
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
// import connectDB from './db/connectDB.js';


// це ми замінили ф-єю env
// import dotenv from "dotenv";
// dotenv.config();
// const port = Number(process.env.PORT) || 3000;


// стартуємо сервер
export const setupServer = () => {
  const app = express();


  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  //  await connectDB();

  // routes
  app.use("/auth", authRouter);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  // виклткаємо ф-цію env
  const port = Number(env('PORT', 3000));

  app.listen(port, () => console.log(`Server running on port ${port}`));
};
