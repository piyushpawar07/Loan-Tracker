import { formatStatus } from '../status'

function StatusBadge({ status }) {
  return <span className={`pill pill-${status}`}>{formatStatus(status)}</span>
}

export default StatusBadge
