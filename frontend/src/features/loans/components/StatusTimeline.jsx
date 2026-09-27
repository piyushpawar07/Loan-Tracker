import { formatStatus } from '../status'
import { formatDateTime } from '../../../shared/utils/format'

function StatusTimeline({ createdAt, applicantName, history }) {
  return (
    <ol className="timeline">
      {createdAt && (
        <li>
          <span className="timeline-change">Application submitted</span>
          <span className="muted">{applicantName} · {formatDateTime(createdAt)}</span>
        </li>
      )}
      {history.map((entry) => (
        <li key={entry.id}>
          <span className="timeline-change">
            {formatStatus(entry.old_status)} → <strong>{formatStatus(entry.new_status)}</strong>
          </span>
          <span className="muted">{entry.user?.name || 'Unknown user'} · {formatDateTime(entry.changed_at)}</span>
        </li>
      ))}
    </ol>
  )
}

export default StatusTimeline
