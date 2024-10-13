const parseContactFilterParams = (query) => {
  const filter = {};

  // Перевіряємо наявність параметра contactType в запиті
  if (query.contactType) {
    filter.contactType = query.contactType; // Додаємо тип контакту до фільтра
  }

  // Додаємо інші параметри фільтрації за потреби
  if (query.isFavourite) {
    filter.isFavourite = query.isFavourite === 'true'; // Перетворення в булевий тип
  }

  return filter;
};

export default parseContactFilterParams;
