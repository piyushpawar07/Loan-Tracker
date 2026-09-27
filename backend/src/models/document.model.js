const prisma = require('../config/db');

function createDocument({ loanId, docType, fileUrl }) {
  return prisma.document.create({
    data: {
      loan_id: loanId,
      doc_type: docType,
      file_url: fileUrl,
    },
  });
}

function findDocumentsByLoanId(loanId) {
  return prisma.document.findMany({
    where: { loan_id: loanId },
    orderBy: { id: 'asc' },
  });
}

function findDocumentById(id) {
  return prisma.document.findUnique({
    where: { id },
    include: { loan: { select: { applicant_id: true, status: true } } },
  });
}

function markVerified(id, verified) {
  return prisma.document.update({
    where: { id },
    data: { verified },
  });
}

module.exports = { createDocument, findDocumentsByLoanId, findDocumentById, markVerified };
