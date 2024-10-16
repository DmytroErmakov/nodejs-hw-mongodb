import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import SessionCollection from '../db/models/Session.js';
import UserCollection from '../db/models/User.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';



// Функція для створення сесії
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  delete data._doc.password; // Видалити пароль перед поверненням

  return data._doc;
};

export const login = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user.id }); // Видалити попередню сесію

  const sessionData = createSession();
  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
  return userSession;
};

// Знайти сесію за токеном доступу
export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

// Оновлення сесії
export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionCollection.deleteOne({ _id: sessionId });
  const sessionData = createSession();
  const userSession = await SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
  return userSession;
};

// Вихід з системи
export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};


export const requestResetToken = async (payload) => {
  const { email } = payload;
  console.log('Email:', email); // Логування email

  const user = await UserCollection.findOne({ email });
  if (!user) {
    console.log('User not found for email:', email); // Логування, якщо користувача не знайдено
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      // html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
      html: html, // Використовуємо згенерований HTML з шаблону
    });
  } catch (error) {
    console.log('Error sending email:', error.message); // Логування помилки при відправці email
    throw createHttpError(500, 'Error sending email');
  }
};

export const findUser = (filter) => UserCollection.findOne(filter);
