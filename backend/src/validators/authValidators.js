const { body } = require('express-validator');
const validate = require('./validate');
const { ALL_ROLES } = require('../constants/roles');

const emailField = () =>
  body('email').trim().notEmpty().withMessage('Email is required').bail()
    .isEmail().withMessage('Email must be a valid email address').bail()
    .toLowerCase();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  emailField(),
  body('password').isString().withMessage('Password is required').bail()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters').bail()
    .custom((pw) => Buffer.byteLength(pw, 'utf8') <= 72)
    .withMessage('Password must be at most 72 bytes'),
  body('role').isIn(ALL_ROLES).withMessage(`Role must be one of: ${ALL_ROLES.join(', ')}`),
  validate,
];

const loginValidation = [
  emailField(),
  body('password').isString().withMessage('Password is required').bail()
    .notEmpty().withMessage('Password is required'),
  validate,
];

module.exports = { registerValidation, loginValidation };
