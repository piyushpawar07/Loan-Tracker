const loanModel = require('../models/loan.model');
const { transitionLoanStatus } = require('../services/loanStateMachine');
const { sendSuccess, sendError } = require('../utils/response');

async function createLoan(req, res) {
  const loan = await loanModel.createLoan({
    applicantId: req.user.userId,
    amount: req.body.amount,
    purpose: req.body.purpose,
  });

  return sendSuccess(res, 201, 'Loan application created successfully', { loan });
}

async function getLoanById(req, res) {
  const loan = await loanModel.findLoanById(req.params.id);

  if (!loan) return sendError(res, 404, 'Loan application not found');

  if (req.user.role === 'applicant' && loan.applicant_id !== req.user.userId) {
    return sendError(res, 403, 'You can only view your own loan applications');
  }

  return sendSuccess(res, 200, 'Loan application retrieved successfully', { loan });
}

async function getLoans(req, res) {
  const loans = await loanModel.findLoansByRole(req.user.userId, req.user.role);
  return sendSuccess(res, 200, 'Loan applications retrieved successfully', { loans });
}

async function getLoanHistory(req, res) {
  const loan = await loanModel.findLoanById(req.params.id);

  if (!loan) return sendError(res, 404, 'Loan application not found');

  if (req.user.role === 'applicant' && loan.applicant_id !== req.user.userId) {
    return sendError(res, 403, 'You can only view history for your own loan');
  }

  const history = await loanModel.getLoanHistory(req.params.id);
  return sendSuccess(res, 200, 'Loan history retrieved successfully', { history });
}

async function updateLoanStatus(req, res) {
  try {
    const loan = await transitionLoanStatus(
      req.params.id,
      req.body.status,
      req.user.userId,
      req.user.role
    );
    return sendSuccess(res, 200, 'Loan status updated successfully', { loan });
  } catch (err) {
    if (err.message === 'Loan application not found') {
      return sendError(res, 404, err.message);
    }
    if (err.message.startsWith('Role ') || err.message.includes('documents are unverified')) {
      return sendError(res, 403, err.message);
    }
    if (err.message.startsWith('Cannot move from ') || err.message.includes('no documents have been uploaded')) {
      return sendError(res, 400, err.message);
    }
    throw err;
  }
}

module.exports = { createLoan, getLoanById, getLoans, getLoanHistory, updateLoanStatus };
