const fs = require('fs');
const documentModel = require('../models/document.model');
const prisma = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

async function uploadDocument(req, res) {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: req.params.loanId },
  });

  if (!loan) {
    if (req.file) fs.unlinkSync(req.file.path);
    return sendError(res, 404, 'Loan application not found');
  }

  if (loan.applicant_id !== req.user.userId) {
    if (req.file) fs.unlinkSync(req.file.path);
    return sendError(res, 403, 'You can only upload documents for your own loan');
  }

  if (loan.status !== 'submitted') {
    if (req.file) fs.unlinkSync(req.file.path);
    return sendError(res, 400, 'Documents can only be uploaded while the loan is submitted');
  }

  if (!req.file) {
    return sendError(res, 400, 'Document file is required');
  }

  if (!req.body.doc_type || !req.body.doc_type.trim()) {
    fs.unlinkSync(req.file.path);
    return sendError(res, 400, 'Document type is required');
  }

  try {
    const document = await documentModel.createDocument({
      loanId: loan.id,
      docType: req.body.doc_type.trim(),
      fileUrl: `/uploads/documents/${req.file.filename}`,
    });
    return sendSuccess(res, 201, 'Document uploaded successfully', { document });
  } catch (err) {
    fs.unlinkSync(req.file.path);
    throw err;
  }
}

async function verifyDocument(req, res) {
  const document = await prisma.document.findUnique({
    where: { id: req.params.documentId },
  });

  if (!document) {
    return sendError(res, 404, 'Document not found');
  }

  if (typeof req.body.verified !== 'boolean') {
    return sendError(res, 400, 'Verified must be true or false');
  }

  const updatedDocument = await documentModel.markVerified(
    document.id,
    req.body.verified
  );
  return sendSuccess(res, 200, 'Document verification updated successfully', {
    document: updatedDocument,
  });
}

module.exports = { uploadDocument, verifyDocument };
