const fs = require('fs');
const path = require('path');
const documentModel = require('../models/document.model');
const loanModel = require('../models/loan.model');
const { uploadDirectory } = require('../utils/uploadConfig');
const { sendSuccess, sendError } = require('../utils/response');

async function uploadDocument(req, res) {
  const loan = await loanModel.findLoanById(req.params.loanId);

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
  const document = await documentModel.findDocumentById(req.params.documentId);

  if (!document) {
    return sendError(res, 404, 'Document not found');
  }

  if (typeof req.body.verified !== 'boolean') {
    return sendError(res, 400, 'Verified must be true or false');
  }

  if (document.loan.status !== 'under_verification') {
    return sendError(res, 400, 'Documents can only be verified while the loan is under verification');
  }

  const updatedDocument = await documentModel.markVerified(
    document.id,
    req.body.verified
  );
  return sendSuccess(res, 200, 'Document verification updated successfully', {
    document: updatedDocument,
  });
}

async function downloadDocument(req, res) {
  const document = await documentModel.findDocumentById(req.params.documentId);

  if (!document) {
    return sendError(res, 404, 'Document not found');
  }

  if (req.user.role === 'applicant' && document.loan.applicant_id !== req.user.userId) {
    return sendError(res, 403, 'You can only view documents for your own loan');
  }

  const fileName = path.basename(document.file_url);
  if (!fs.existsSync(path.join(uploadDirectory, fileName))) {
    return sendError(res, 404, 'Document file is missing on the server');
  }

  return res.sendFile(fileName, { root: uploadDirectory });
}

module.exports = { uploadDocument, verifyDocument, downloadDocument };
