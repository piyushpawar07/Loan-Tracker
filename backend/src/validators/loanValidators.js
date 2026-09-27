const { body } = require('express-validator');
const validate = require('./validate');

const createLoanValidation = [
  body('amount')
    .exists().withMessage('Amount is required').bail()
    .isInt({ min: 10000, max: 10000000 })
    .withMessage('Amount must be a whole number of rupees between ₹10,000 and ₹1,00,00,000')
    .toInt(),
  body('purpose')
    .trim().notEmpty().withMessage('Purpose is required').bail()
    .isLength({ max: 200 }).withMessage('Purpose must be at most 200 characters'),
  validate,
];

const statusValidation = [
  body('status').isString().notEmpty().withMessage('Status is required'),
  validate,
];

module.exports = { createLoanValidation, statusValidation };
