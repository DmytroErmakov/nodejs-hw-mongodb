import mongoose from 'mongoose';

import { env } from '../utils/env.js';


export const initMongoBD = async () => {
  try {
    const user = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    //   console.log({ user, password, url, db });

    //   const DB_HOST = `mongodb+srv://demchik22:pZvDfDZh73OGXdBb@cluster0.rco66.mongodb.net/students?retryWrites=true&w=majority&appName=Cluster0`;
      const DB_HOST = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
   await mongoose.connect(DB_HOST);
    console.log('MongoDB connection succesfully');
  } catch (error) {
    console.log('MongoDB connection error', error.message);
    throw error;
  }
};
