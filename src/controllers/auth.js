import * as authServices from '../services/auth.js';

export const signupController = async (req, res) => {
  try {
    // Логування даних, що надходять до контролера
    console.log('Request body: ', req.body);

    const newUser = await authServices.signup(req.body);

    // Логування після успішної валідації
    console.log('New user created: ', newUser);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered user',
      data: newUser,
    });
  } catch (error) {
    // Логування помилки
    console.error('Validation or Signup Error: ', error.message);
    
    res.status(400).json({
      status: 400,
      message: error.message || 'Failed to register user',
    });
  }
};
