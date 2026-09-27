import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatDate, formatINR, formatShortId } from '../../../shared/utils/format'

function DocumentProgress({ documents = [], showBar = true }) {
  if (!documents.length) return <span className="muted">None yet</span>
  const verified = documents.filter((document) => document.verified).length
  return (
    <span className="doc-progress" title={`${verified} of ${documents.length} verified`}>
      {showBar && <span className="doc-progress-bar"><span style={{ width: `${(verified / documents.length) * 100}%` }} /></span>}
      <span className="doc-progress-text">{verified}/{documents.length}</span>
    </span>
  )
}

function QueueTable({ loans, selectedId, onSelect }) {
  return (
    <div className="table-wrap">
      <table className="table table-compact">
        <thead>
          <tr>
            <th>Application</th>
            <th className="numeric">Amount</th>
            <th>Docs</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className={`row-clickable ${selectedId === loan.id ? 'row-selected' : ''}`} onClick={() => onSelect(loan.id)}>
              <td className="queue-cell">
                <button type="button" className="queue-title" onClick={(event) => { event.stopPropagation(); onSelect(loan.id) }} aria-pressed={selectedId === loan.id} title={loan.purpose}>
                  {loan.purpose}
                </button>
                <span className="queue-meta">{loan.applicant?.name} · <span className="mono">{formatShortId(loan.id)}</span></span>
              </td>
              <td className="numeric amount">{formatINR(loan.amount)}</td>
              <td className="nowrap"><DocumentProgress documents={loan.documents} showBar={false} /></td>
              <td><StatusBadge status={loan.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LoanTable({ loans, compact = false, linkTo, selectedId, onSelect }) {
  const navigate = useNavigate()

  if (compact) return <QueueTable loans={loans} selectedId={selectedId} onSelect={onSelect} />

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Purpose</th>
            <th className="numeric">Amount</th>
            <th>Documents</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="row-clickable" onClick={() => navigate(linkTo(loan))}>
              <td className="mono">
                <Link to={linkTo(loan)} onClick={(event) => event.stopPropagation()}>{formatShortId(loan.id)}</Link>
              </td>
              <td className="truncate" title={loan.purpose}>{loan.purpose}</td>
              <td className="numeric amount">{formatINR(loan.amount)}</td>
              <td className="nowrap"><DocumentProgress documents={loan.documents} /></td>
              <td><StatusBadge status={loan.status} /></td>
              <td className="nowrap muted">{formatDate(loan.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LoanTable
