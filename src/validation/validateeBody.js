const { body, validationResult } = require('express-validator');

const validateBody = [
  body('email').isEmail().withMessage('Email is not valid'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateBody;
