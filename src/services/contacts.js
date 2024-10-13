import ContactCollection from '../db/models/Contact.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
  contactType,
  type,
  isFavourite,
}) => {
  if (type) {
    filter.contactType = type; // фільтрація за типом
  }
  if (contactType) {
    filter.contactType = contactType;
  }
  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite; // фільтрація за isFavourite
  }

  const skip = (page - 1) * perPage;
  const contacts = await ContactCollection.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const count = await ContactCollection.countDocuments(filter);
  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts,
    totalItems: count,
    ...paginationData,
  };
};

export const getContact = (filter) => ContactCollection.findOne(filter);

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
