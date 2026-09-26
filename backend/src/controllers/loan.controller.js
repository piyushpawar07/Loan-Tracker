const loanModel = require('../models/loan.model');
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

module.exports = { createLoan, getLoanById, getLoans };
