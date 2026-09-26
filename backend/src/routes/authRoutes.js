const express = require('express');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logoutUser);

module.exports = router;
