import { addUserEmail } from '../services/userService.js';

export const createUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  try {
    const user = await addUserEmail(email, username, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
