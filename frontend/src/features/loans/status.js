export const STATUS_LABELS = {
  submitted: 'Submitted',
  under_verification: 'Under verification',
  verified: 'Verified',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
}

export const STATUS_ORDER = Object.keys(STATUS_LABELS)

export const APPLICANT_NEXT_STEP = {
  submitted: 'Upload your supporting documents. A verifier will start the review once they are in.',
  under_verification: 'A verifier is checking your documents.',
  verified: 'Documents are verified. Waiting for an approver’s decision.',
  approved: 'Approved. Waiting for disbursement.',
  rejected: 'This application was rejected.',
  disbursed: 'The loan amount has been disbursed.',
}

export function formatStatus(status) {
  return STATUS_LABELS[status] || status
}
