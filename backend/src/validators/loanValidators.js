const { body } = require('express-validator');
const validate = require('./validate');

const createLoanValidation = [
  body('amount')
    .exists().withMessage('Amount is required').bail()
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number')
    .toFloat(),
  body('purpose')
    .trim().notEmpty().withMessage('Purpose is required').bail()
    .isLength({ max: 200 }).withMessage('Purpose must be at most 200 characters'),
  validate,
];

module.exports = { createLoanValidation };
