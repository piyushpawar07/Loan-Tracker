const prisma = require('../config/db');

const allowedTransitions = {
  submitted: ['under_verification'],
  under_verification: ['verified', 'rejected'],
  verified: ['approved', 'rejected'],
  approved: ['disbursed'],
  rejected: [],
  disbursed: [],
};

async function transitionLoanStatus(loanId, newStatus, userId, role) {
  const loan = await prisma.loanApplication.findUnique({ where: { id: loanId } });

  if (!loan) {
    throw new Error('Loan application not found');
  }

  const nextStatuses = allowedTransitions[loan.status] || [];
  if (!nextStatuses.includes(newStatus)) {
    throw new Error(`Cannot move from ${loan.status} to ${newStatus}`);
  }

  const verifierCanChange =
    role === 'verifier' &&
    ((loan.status === 'submitted' && newStatus === 'under_verification') ||
      (loan.status === 'under_verification' && ['verified', 'rejected'].includes(newStatus)));
  const approverCanChange =
    role === 'approver' &&
    ((loan.status === 'verified' && ['approved', 'rejected'].includes(newStatus)) ||
      (loan.status === 'approved' && newStatus === 'disbursed'));

  if (!verifierCanChange && !approverCanChange) {
    throw new Error(`Role ${role} cannot move a loan from ${loan.status} to ${newStatus}`);
  }

  if (newStatus === 'verified') {
    const unverifiedDocument = await prisma.document.findFirst({
      where: { loan_id: loanId, verified: false },
    });
    if (unverifiedDocument) {
      throw new Error('Cannot move to verified while documents are unverified');
    }
  }

  return prisma.$transaction(async (transaction) => {
    const updatedLoan = await transaction.loanApplication.update({
      where: { id: loanId },
      data: { status: newStatus },
    });

    await transaction.loanStatusHistory.create({
      data: {
        loan_id: loanId,
        old_status: loan.status,
        new_status: newStatus,
        changed_by: userId,
      },
    });

    return updatedLoan;
  });
}

module.exports = { allowedTransitions, transitionLoanStatus };