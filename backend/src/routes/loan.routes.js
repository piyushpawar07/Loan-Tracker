const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { ROLES } = require('../constants/roles');
const { createLoanValidation, statusValidation } = require('../validators/loanValidators');
const {
  createLoan,
  getLoanById,
  getLoans,
  getLoanHistory,
  updateLoanStatus,
} = require('../controllers/loan.controller');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize(ROLES.APPLICANT),
  createLoanValidation,
  createLoan
);
router.get('/', authenticate, authorize(...Object.values(ROLES)), getLoans);
router.get(
  '/:id/history',
  authenticate,
  authorize(...Object.values(ROLES)),
  getLoanHistory
);
router.patch(
  '/:id/status',
  authenticate,
  authorize(ROLES.VERIFIER, ROLES.APPROVER),
  statusValidation,
  updateLoanStatus
);
router.get('/:id', authenticate, authorize(...Object.values(ROLES)), getLoanById);

module.exports = router;
