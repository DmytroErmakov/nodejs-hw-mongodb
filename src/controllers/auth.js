import * as authServices from '../services/auth.js';

export const signupController = async (req, res) => {
  try {
    const newUser = await authServices.signup(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered user',
      data: newUser,
    });
  } catch (error) {
    console.error('Signup Error: ', error);
    res.status(400).json({
      status: 400,
      message: error.message || 'Failed to register user',
    });
  }
};
