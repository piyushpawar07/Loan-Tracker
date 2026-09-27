import ReviewWorkspace from '../../loans/components/ReviewWorkspace'
import { useReviewQueue } from '../../loans/hooks/useReviewQueue'
import { updateLoanStatus } from '../../loans/api/loan.api'
import { verifyDocument } from '../../documents/api/document.api'

function verificationBlocker(loan) {
  const documents = loan.documents || []
  if (!documents.length) return 'The applicant has not uploaded any documents yet.'
  const pending = documents.filter((document) => !document.verified).length
  if (pending) return `${pending} of ${documents.length} documents still need to be verified.`
  return ''
}

function verifierStats(loans) {
  const pendingDocuments = loans
    .flatMap((loan) => loan.documents || [])
    .filter((document) => !document.verified).length
  return [
    { icon: 'inbox', label: 'In queue', value: loans.length, tone: 'indigo' },
    { icon: 'clock', label: 'Waiting to start', value: loans.filter((loan) => loan.status === 'submitted').length, tone: 'slate' },
    { icon: 'shield', label: 'Under verification', value: loans.filter((loan) => loan.status === 'under_verification').length, tone: 'amber' },
    { icon: 'file', label: 'Documents to check', value: pendingDocuments, tone: 'teal' },
  ]
}

function VerifierDashboard() {
  const queue = useReviewQueue()

  function changeStatus(status, confirmText) {
    if (confirmText && !window.confirm(confirmText)) return
    queue.runAction(`status-${status}`, () => updateLoanStatus(queue.selectedId, status))
  }

  function renderActions(loan, pendingAction) {
    const busy = Boolean(pendingAction)

    if (loan.status === 'submitted') {
      return (
        <div className="actions">
          <button type="button" className="button button-primary" onClick={() => changeStatus('under_verification')} disabled={busy}>
            {pendingAction === 'status-under_verification' ? 'Starting…' : 'Start verification'}
          </button>
          <span className="muted">Documents can be verified once verification has started.</span>
        </div>
      )
    }

    if (loan.status === 'under_verification') {
      const blocker = verificationBlocker(loan)
      return (
        <div className="actions">
          <button type="button" className="button button-success" onClick={() => changeStatus('verified')} disabled={busy || Boolean(blocker)}>
            {pendingAction === 'status-verified' ? 'Saving…' : 'Mark loan verified'}
          </button>
          <button type="button" className="button button-danger" onClick={() => changeStatus('rejected', 'Reject this loan application? This cannot be undone.')} disabled={busy}>
            {pendingAction === 'status-rejected' ? 'Rejecting…' : 'Reject loan'}
          </button>
          {blocker && <span className="muted">{blocker}</span>}
        </div>
      )
    }

    return <p className="muted">No verifier actions at this status.</p>
  }

  return (
    <ReviewWorkspace
      title="Verification queue"
      subtitle="Check each applicant’s documents before the loan moves to an approver."
      stats={verifierStats}
      emptyText="No applications are waiting for verification."
      queue={queue}
      canVerifyDocuments={(loan) => loan.status === 'under_verification'}
      onVerifyDocument={(documentId, verified) => queue.runAction(`document-${documentId}`, () => verifyDocument(documentId, verified))}
      renderActions={renderActions}
    />
  )
}

export default VerifierDashboard
