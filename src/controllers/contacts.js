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

export const getAllContactsController = async (req, res, next) => {
  const { perPage, page } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const filter = parseContactFilterParams(req.query);
  const { _id: userId } = req.user;

  // Додаємо userId до фільтру
  filter.userId = userId;

  // Якщо потрібна фільтрація за isFavourite, обробляємо це
  if (req.query.isFavourite) {
    filter.isFavourite = req.query.isFavourite === 'true'; // Конвертуємо рядок у булевий тип
  }

  try {
    const data = await contactServices.getContacts({
      perPage,
      page,
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data,
    });
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error fetching contacts'));
  }
};

export const getContactsByIdController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const data = await contactServices.getContact({ _id: id, userId });

    if (!data) {
      return next(createHttpError(404, `Contact with id=${id} not found`));
    }

    res.json({
      status: 200,
      message: `Contact with id=${id} successfully found`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const addContactController = async (req, res, next) => {
  try {
    await contactAddSchema.validateAsync(req.body, { abortEarly: false });
    const { _id: userId } = req.user;
    const data = await contactServices.createContact({ ...req.body, userId });

    res.status(201).json({
      status: 201,
      message: 'Contact added successfully',
      data,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        errors: error.details,
      });
    }

    next(createHttpError(500, 'Error adding contact'));
  }
};

export const upsertContactController = async (req, res, next) => {
  try {
    await contactPatchSchema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: error.details,
    });
  }

  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const { isNew, data } = await contactServices.updateContact(
      { _id: id, userId },
      req.body,
      { upsert: true },
    );

    const status = isNew ? 201 : 200;

    res.status(status).json({
      status,
      message: 'Contact upserted successfully',
      data,
    });
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error upserting contact'));
  }
};

export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const result = await contactServices.updateContact(
      { _id: id, userId },
      req.body,
    );

    if (!result) {
      return next(createHttpError(404, `Contact with id=${id} not found`));
    }

    res.json({
      status: 200,
      message: 'Contact patched successfully',
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error patching contact'));
  }
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  try {
    const data = await contactServices.deleteContact({ _id: id, userId });

    if (!data) {
      return next(createHttpError(404, `Contact with id=${id} not found`));
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error deleting contact'));
  }
};
