import AppLayout from '../../../shared/components/AppLayout'
import StatCard from '../../../shared/components/StatCard'
import Icon from '../../../shared/components/Icon'
import DocumentList from '../../documents/components/DocumentList'
import LoanSummary from './LoanSummary'
import LoanTable from './LoanTable'
import StatusStepper from './StatusStepper'
import StatusTimeline from './StatusTimeline'

function ReviewWorkspace({ title, subtitle, stats, emptyText, queue, canVerifyDocuments, onVerifyDocument, renderActions }) {
  const { loans, listLoading, listError, selectedId, loan, history, detailLoading, detailError, pendingAction, actionError } = queue

  return (
    <AppLayout title={title} subtitle={subtitle}>
      <section className="stats">
        {stats(loans).map((stat) => <StatCard key={stat.label} {...stat} value={listLoading ? '—' : stat.value} />)}
      </section>

      <div className="review-layout">
        <section className="card">
          <div className="card-heading">
            <h2>Queue</h2>
            <span className="count-badge">{loans.length}</span>
          </div>
          {listLoading && <div className="skeleton-rows"><span /><span /><span /></div>}
          {listError && <p className="alert alert-error" role="alert">{listError}</p>}
          {!listLoading && !listError && !loans.length && (
            <div className="empty">
              <span className="empty-icon"><Icon name="inbox" size={28} /></span>
              <h3>All caught up</h3>
              <p>{emptyText}</p>
            </div>
          )}
          {loans.length > 0 && <LoanTable loans={loans} compact selectedId={selectedId} onSelect={queue.selectLoan} />}
        </section>

        <section className="card review-panel">
          {!selectedId && (
            <div className="empty">
              <span className="empty-icon"><Icon name="eye" size={28} /></span>
              <h3>Select an application</h3>
              <p>Pick a row from the queue to see its documents, history and available actions.</p>
            </div>
          )}
          {selectedId && detailLoading && <div className="skeleton-rows"><span /><span /><span /></div>}
          {selectedId && detailError && <p className="alert alert-error" role="alert">{detailError}</p>}
          {loan && (
            <>
              <div className="card-heading">
                <h2>{loan.purpose}</h2>
              </div>
              <StatusStepper status={loan.status} createdAt={loan.created_at} history={history} />

              <div className="action-box">
                <h3>Next action</h3>
                {actionError && <p className="alert alert-error" role="alert">{actionError}</p>}
                {renderActions(loan, pendingAction)}
              </div>

              <h3 className="section-title">Details</h3>
              <LoanSummary loan={loan} />

              <h3 className="section-title">Documents</h3>
              <DocumentList
                documents={loan.documents || []}
                canVerify={canVerifyDocuments?.(loan)}
                onVerify={onVerifyDocument}
                pendingAction={pendingAction}
              />

              <h3 className="section-title">Activity</h3>
              <StatusTimeline createdAt={loan.created_at} applicantName={loan.applicant?.name} history={history} />
            </>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

export default ReviewWorkspace
