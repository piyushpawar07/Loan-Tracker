import { Link } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import StatCard from '../../../shared/components/StatCard'
import Icon from '../../../shared/components/Icon'
import { useAuthContext } from '../../auth/state/useAuthContext'
import { useLoans } from '../hooks/useLoans'
import LoanTable from '../components/LoanTable'
import { formatINR } from '../../../shared/utils/format'

const IN_PROGRESS = ['submitted', 'under_verification', 'verified', 'approved']

function Dashboard() {
  const { user } = useAuthContext()
  const { loans, loading, error } = useLoans()
  const count = (statuses) => loans.filter((loan) => statuses.includes(loan.status)).length
  const totalRequested = loans.reduce((sum, loan) => sum + Number(loan.amount), 0)
  const firstName = user?.name?.split(' ')[0]

  return (
    <AppLayout
      title={firstName ? `Welcome back, ${firstName}` : 'My applications'}
      subtitle="Track every loan application from submission to disbursement."
      actions={<Link className="button button-primary" to="/loans/new"><Icon name="plus" size={16} />New application</Link>}
    >
      <section className="stats">
        <StatCard icon="list" label="Total applications" value={loading ? '—' : loans.length} tone="indigo" />
        <StatCard icon="clock" label="In progress" value={loading ? '—' : count(IN_PROGRESS)} hint="Awaiting a decision or payout" tone="amber" />
        <StatCard icon="check" label="Disbursed" value={loading ? '—' : count(['disbursed'])} tone="green" />
        <StatCard icon="wallet" label="Total requested" value={loading ? '—' : formatINR(totalRequested)} tone="teal" />
      </section>

      <section className="card">
        <div className="card-heading">
          <h2>Your applications</h2>
          <span className="muted">Click a row to open it</span>
        </div>
        {loading && <div className="skeleton-rows" aria-label="Loading applications"><span /><span /><span /></div>}
        {error && <p className="alert alert-error" role="alert">{error}</p>}
        {!loading && !error && !loans.length && (
          <div className="empty">
            <span className="empty-icon"><Icon name="inbox" size={28} /></span>
            <h3>No applications yet</h3>
            <p>Start your first loan application. It takes less than a minute.</p>
            <Link className="button button-primary" to="/loans/new">Create application</Link>
          </div>
        )}
        {loans.length > 0 && <LoanTable loans={loans} linkTo={(loan) => `/loans/${loan.id}`} />}
      </section>
    </AppLayout>
  )
}

export default Dashboard
