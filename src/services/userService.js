import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';

export const addUserEmail = async (email, username, password) => {
  try {
    const newUser = await UserCollection.create({ email, username, password });
    console.log('User added:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error.message, error.stack);
    throw createHttpError(500, 'Error adding user');
  }
};
