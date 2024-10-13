import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';

import parsePaginationParams from '../utils/parsePaginationParams.js';

import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Contact.js';

import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';

import {
  contactAddSchema,
  contactPatchSchema,
} from '../validation/contacts.js';

export const getAllContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);

  console.log('req.query:', req.query);

  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });

  const filter = parseContactFilterParams(req.query);
  const { type, isFavourite } = req.query;

  // додаємо інфо про юзера
  const { _id: userId } = req.user;

  console.log('sortBy:', sortBy); // Логує параметр сортування
  console.log('sortOrder:', sortOrder); // Логує порядок сортування (asc або desc)

  if (type) {
    filter.contactType = type; // додаємо фільтрацію за типом
  }

  try {
    const data = await contactServices.getContacts({
      perPage,
      page,
      sortBy,
      sortOrder,
      filter: { ...filter, userId },
      isFavorite:
        isFavourite === 'true'
          ? true
          : isFavourite === 'false'
          ? false
          : undefined, // фільтр за обраними
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

export const getContactsByIdController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const data = await contactServices.getContact({ _id: id, userId });

    if (!data) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
      status: 200,
      message: `Contact with id=${id} successfully found`,
      data,
    });
  } catch (error) {
    // Перевіряємо, чи це наша помилка 404, або інша помилка
    if (error.status === 404) {
      res.status(404).json({
        status: 404,
        message: error.message,
      });
    } else {
      // Для інших помилок
      res.status(500).json({
        status: 500,
        message: 'An error occurred while fetching the contact',
        error: error.message,
      });
    }
  }
};

export const addContactController = async (req, res) => {
  try {
    // Валідація вхідних даних
    await contactAddSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    console.log('Validation success');

    // отримуємо юзера
    const { _id: userId } = req.user;
    // Створюємо контакт
    const data = await contactServices.createContact({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact added successfully',
      data,
    });
  } catch (error) {
    // Обробка помилок валідації
    if (error.isJoi) {
      console.log(error.message);
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        errors: error.details, // деталі помилки
      });
    }

    // Обробка загальних помилок
    console.error('Error creating contact:', error);
    return res.status(500).json({
      status: 500,
      message: 'An error occurred while adding the contact',
      error: error.message,
    });
  }
};

export const upsertContactController = async (req, res) => {
  try {
    // Валідація вхідних даних
    await contactPatchSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    console.log('Validation success');
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: error.details, // деталі помилки
    });
  }

  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    // Оновлення або вставка контакту
    const { isNew, data } = await contactServices.updateContact(
      { _id: id, userId },
      req.body,
      { upsert: true },
    );

    const status = isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Contact upsert successfully',
      data,
    });
  } catch (error) {
    // Обробка загальних помилок
    console.error('Error upserting contact:', error);
    return res.status(500).json({
      status: 500,
      message: 'An error occurred while upserting the contact',
      error: error.message, // деталі помилки
    });
  }
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    // Оновлення контакту
    const result = await contactServices.updateContact(
      { _id: id, userId },
      req.body,
    );

    if (!result) {
      throw createHttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
      status: 200,
      message: 'Contact patched successfully',
      data: result.data,
    });
  } catch (error) {
    // Обробка помилок
    if (error.isHttpError) {
      // Якщо це помилка, створена з http-errors
      res.status(error.status).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Якщо це інша помилка
      console.error('Error patching contact:', error);
      res.status(500).json({
        status: 500,
        message: 'An error occurred while patching the contact',
        error: error.message, // Деталі помилки
      });
    }
  }
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id: id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }
  res.status(204).send();
};
