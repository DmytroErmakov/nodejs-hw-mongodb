import * as authServices from '../services/auth.js';

const setupSession = (res, session) => {
res.cookie('refreshToken', session.refreshToken, {
  httpOnly: true,
  expires: new Date(Date.now() + session.refreshTokenValidUntil),
});

res.cookie('sessionId', session._id, {
  httpOnly: true,
  expires: new Date(Date.now() + session.refreshTokenValidUntil),
});
};

export const registerController = async (req, res, next) => {
  try {
    const newUser = await authServices.register(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully register a user',
      data: newUser,
    });
   } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

export const loginController = async (req, res, next) => {
  try {
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;
    const session = await authServices.refreshSession({
      refreshToken,
      sessionId,
    });

    setupSession(res, session);

    res.json({
      status: 200,
      message: 'Successfully refresh a session',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
  }
};

export const logoutController = async (req, res, next) => {
  try {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await authServices.logout(sessionId);
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
   } catch (error) {
    next(error); // Передаємо помилку в middleware для обробки помилок
   }
  };
