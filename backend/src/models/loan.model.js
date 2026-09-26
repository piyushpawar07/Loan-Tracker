const prisma = require('../config/db');

const applicantFields = {
  id: true,
  name: true,
  email: true,
};

function createLoan({ applicantId, amount, purpose }) {
  return prisma.loanApplication.create({
    data: {
      applicant_id: applicantId,
      amount,
      purpose,
      status: 'submitted',
    },
    include: { applicant: { select: applicantFields } },
  });
}

function findLoanById(id) {
  return prisma.loanApplication.findUnique({
    where: { id },
    include: { applicant: { select: applicantFields } },
  });
}

function findLoansByRole(userId, role) {
  let where;

  if (role === 'applicant') {
    where = { applicant_id: userId };
  } else if (role === 'verifier') {
    where = { status: { in: ['submitted', 'under_verification'] } };
  } else if (role === 'approver') {
    where = { status: 'verified' };
  } else {
    where = { id: '__no_matching_role__' };
  }

  return prisma.loanApplication.findMany({
    where,
    orderBy: { created_at: 'desc' },
    include: { applicant: { select: applicantFields } },
  });
}

function updateLoanStatus(id, status) {
  return prisma.loanApplication.update({
    where: { id },
    data: { status },
    include: { applicant: { select: applicantFields } },
  });
}

module.exports = { createLoan, findLoanById, findLoansByRole, updateLoanStatus };
