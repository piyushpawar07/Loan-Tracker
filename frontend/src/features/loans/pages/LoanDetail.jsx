import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import Icon from '../../../shared/components/Icon'
import { useLoanDetail } from '../hooks/useLoanDetail'
import LoanSummary from '../components/LoanSummary'
import StatusStepper from '../components/StatusStepper'
import StatusTimeline from '../components/StatusTimeline'
import DocumentList from '../../documents/components/DocumentList'
import DocumentUpload from '../../documents/components/DocumentUpload'
import { APPLICANT_NEXT_STEP } from '../status'
import { formatShortId } from '../../../shared/utils/format'

function LoanDetail() {
  const { loanId } = useParams()
  const { loan, history, loading, error, reload } = useLoanDetail(loanId)
  const backLink = <Link className="button button-ghost" to="/dashboard"><Icon name="arrowLeft" size={16} />All applications</Link>

  if (loading) {
    return <AppLayout title="Loan application" actions={backLink}><div className="card"><div className="skeleton-rows"><span /><span /><span /></div></div></AppLayout>
  }
  if (error || !loan) {
    return (
      <AppLayout title="Loan application" actions={backLink}>
        <p className="alert alert-error" role="alert">{error || 'Loan application not found.'}</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={loan.purpose} subtitle={`Application ${formatShortId(loan.id)}`} actions={backLink}>
      <section className="card">
        <StatusStepper status={loan.status} createdAt={loan.created_at} history={history} />
        <p className={`next-step next-step-${loan.status}`}>{APPLICANT_NEXT_STEP[loan.status]}</p>
      </section>

      <div className="detail-layout">
        <section className="card">
          <div className="card-heading"><h2>Summary</h2></div>
          <LoanSummary loan={loan} />
        </section>
        <section className="card">
          <div className="card-heading"><h2>Activity</h2></div>
          <StatusTimeline createdAt={loan.created_at} applicantName={loan.applicant?.name} history={history} />
        </section>
        <section className="card detail-wide">
          <div className="card-heading">
            <h2>Documents</h2>
            <span className="muted">{(loan.documents || []).length} uploaded</span>
          </div>
          <DocumentList documents={loan.documents || []} />
          {loan.status === 'submitted'
            ? <DocumentUpload loanId={loan.id} onUploaded={reload} />
            : <p className="muted upload-closed">Documents can only be uploaded while the application is submitted.</p>}
        </section>
      </div>
    </AppLayout>
  )
}

export default LoanDetail
