const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { ROLES } = require('../constants/roles');
const { uploadDocument: uploadMiddleware } = require('../utils/uploadConfig');
const {
  uploadDocument,
  verifyDocument,
} = require('../controllers/document.controller');

const router = express.Router();

router.post(
  '/loans/:loanId/documents',
  authenticate,
  authorize(ROLES.APPLICANT),
  uploadMiddleware.single('file'),
  uploadDocument
);
router.patch(
  '/documents/:documentId/verify',
  authenticate,
  authorize(ROLES.VERIFIER),
  verifyDocument
);

module.exports = router;
