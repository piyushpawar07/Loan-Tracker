import ReviewWorkspace from '../../loans/components/ReviewWorkspace'
import { useReviewQueue } from '../../loans/hooks/useReviewQueue'
import { updateLoanStatus } from '../../loans/api/loan.api'
import { formatINR } from '../../../shared/utils/format'

function approverStats(loans) {
  const awaitingDecision = loans.filter((loan) => loan.status === 'verified')
  const awaitingPayout = loans.filter((loan) => loan.status === 'approved')
  const sum = (items) => items.reduce((total, loan) => total + Number(loan.amount), 0)
  return [
    { icon: 'stamp', label: 'Awaiting decision', value: awaitingDecision.length, tone: 'indigo' },
    { icon: 'wallet', label: 'Value awaiting decision', value: formatINR(sum(awaitingDecision)), tone: 'teal' },
    { icon: 'clock', label: 'Awaiting disbursement', value: awaitingPayout.length, tone: 'amber' },
    { icon: 'check', label: 'Value to disburse', value: formatINR(sum(awaitingPayout)), tone: 'green' },
  ]
}

function ApproverDashboard() {
  const queue = useReviewQueue()

  function changeStatus(status, confirmText) {
    if (!window.confirm(confirmText)) return
    queue.runAction(`status-${status}`, () => updateLoanStatus(queue.selectedId, status))
  }

  function renderActions(loan, pendingAction) {
    const busy = Boolean(pendingAction)
    const amount = formatINR(loan.amount)

    if (loan.status === 'verified') {
      return (
        <div className="actions">
          <button type="button" className="button button-success" onClick={() => changeStatus('approved', `Approve this loan for ${amount}?`)} disabled={busy}>
            {pendingAction === 'status-approved' ? 'Approving…' : 'Approve loan'}
          </button>
          <button type="button" className="button button-danger" onClick={() => changeStatus('rejected', 'Reject this loan application? This cannot be undone.')} disabled={busy}>
            {pendingAction === 'status-rejected' ? 'Rejecting…' : 'Reject loan'}
          </button>
        </div>
      )
    }

    if (loan.status === 'approved') {
      return (
        <div className="actions">
          <button type="button" className="button button-success" onClick={() => changeStatus('disbursed', `Confirm that ${amount} has been disbursed?`)} disabled={busy}>
            {pendingAction === 'status-disbursed' ? 'Saving…' : 'Mark as disbursed'}
          </button>
        </div>
      )
    }

    return <p className="muted">No approver actions at this status.</p>
  }

  return (
    <ReviewWorkspace
      title="Approval queue"
      subtitle="Make the final decision on verified loans and confirm disbursements."
      stats={approverStats}
      emptyText="No applications are waiting for a decision or disbursement."
      queue={queue}
      renderActions={renderActions}
    />
  )
}

export default ApproverDashboard
