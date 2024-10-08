import UserCollection from '../db/models/User.js';

export const signup = async (payload) => {
  try {
    const data = await UserCollection.create(payload);
    delete data._doc.password;
    return data._doc;
  } catch (error) {
    throw new Error('User creation failed: ' + error.message);
  }
};
