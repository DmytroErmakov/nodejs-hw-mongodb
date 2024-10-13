import * as authServices from '../services/auth.js';

import { requestResetToken } from '../services/auth.js';

const setupSession = (res, session) => {
res.cookie('refreshToken', session.refreshToken, {
  httpOnly: true,
  expire: new Date(Date.now() + session.refreshTokenValidUntil),
});

res.cookie('sessionId', session._id, {
  httpOnly: true,
  expire: new Date(Date.now() + session.refreshTokenValidUntil),
});
};

export const registerController = async (req, res) => {

  const newUser = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully register a user',
    data: newUser,
  });
};

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authServices.refreshSession({ refreshToken, sessionId });

  setupSession(res, session);

   res.json({
     status: 200,
     message: 'Successfully refresh a session',
     data: {
       accessToken: session.accessToken,
     },
   });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await authServices.logout(sessionId);
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};




export const requestResetEmailController = async (req, res, next) => {
  const { email } = req.body;
  console.log('Received email:', email); // Додаємо логування
  try {
    await requestResetToken({ email });
    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    next(error);
  }
};
