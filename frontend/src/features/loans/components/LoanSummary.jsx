import StatusBadge from './StatusBadge'
import { formatDateTime, formatINR, formatShortId } from '../../../shared/utils/format'

function LoanSummary({ loan }) {
  return (
    <dl className="summary">
      <div><dt>Application</dt><dd className="mono">{formatShortId(loan.id)}</dd></div>
      <div><dt>Status</dt><dd><StatusBadge status={loan.status} /></dd></div>
      <div><dt>Amount</dt><dd className="amount">{formatINR(loan.amount)}</dd></div>
      <div><dt>Applicant</dt><dd>{loan.applicant?.name}<span className="summary-sub">{loan.applicant?.email}</span></dd></div>
      <div className="summary-wide"><dt>Purpose</dt><dd>{loan.purpose}</dd></div>
      <div><dt>Submitted</dt><dd>{formatDateTime(loan.created_at)}</dd></div>
      <div><dt>Last updated</dt><dd>{formatDateTime(loan.updated_at)}</dd></div>
    </dl>
  )
}

export default LoanSummary
