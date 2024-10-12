import ContactCollection from '../db/models/Contact.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
  type,
  isFavourite,
}) => {

  // const filter = {}; // створюємо об'єкт для фільтрації

  if (type) {
    filter.contactType = type; // фільтрація за типом
  }

  if (filter.userId) {
    ContactCollection.where("userId").equals(filter.userId);
  }

  if (typeof isFavourite !== "undefined") {
    filter.isFavourite = isFavourite; //фільтрація за isFavourite
  }

  const skip = (page - 1) * perPage;
  // додаємо фільтр
  const contacts = await ContactCollection.find(filter).skip(skip).limit(perPage).sort({ [sortBy]: sortOrder });
  const count = await ContactCollection.find().countDocuments(filter);

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts,
    totalItems: count,
    ...paginationData,
  };
};

export const getContact = filter => ContactCollection.findById(filter);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
