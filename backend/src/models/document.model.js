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

function markVerified(id, verified) {
  return prisma.document.update({
    where: { id },
    data: { verified },
  });
}

module.exports = { createDocument, findDocumentsByLoanId, markVerified };
