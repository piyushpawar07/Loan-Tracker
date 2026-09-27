const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { ROLES } = require('../constants/roles');
const { uploadDocument: uploadMiddleware } = require('../utils/uploadConfig');
const {
  uploadDocument,
  verifyDocument,
  downloadDocument,
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
router.get(
  '/documents/:documentId/file',
  authenticate,
  authorize(...Object.values(ROLES)),
  downloadDocument
);

module.exports = router;
