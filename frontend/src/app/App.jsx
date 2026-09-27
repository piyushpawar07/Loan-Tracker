import { useAuthContext } from '../features/auth/state/useAuthContext'
import './App.scss'

const summaries = [
  { label: 'Active applications', value: '04', detail: '+2 this month', tone: 'green' },
  { label: 'Awaiting review', value: '02', detail: 'Across your queue', tone: 'amber' },
  { label: 'Average response', value: '2.4d', detail: '↓ 18% from last month', tone: 'blue' },
]

const applications = [
  { id: 'LN-2048', borrower: 'Jamie Rivera', purpose: 'Home improvement', amount: '$24,500', status: 'Under verification', date: 'Sep 25, 2026' },
  { id: 'LN-2047', borrower: 'Mina Patel', purpose: 'Business equipment', amount: '$68,200', status: 'Verified', date: 'Sep 23, 2026' },
  { id: 'LN-2043', borrower: 'Chris Okafor', purpose: 'Education', amount: '$12,800', status: 'Submitted', date: 'Sep 21, 2026' },
]

function App() {
  const { user, logout } = useAuthContext()
  const isApplicant = user?.role === 'applicant'

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><span className="brand-mark small">LT</span><span>Loan Tracker</span></div>
        <div className="workspace-label">Workspace</div>
        <nav>
          <a className="nav-item active" href="/dashboard"><span>◈</span> Overview</a>
          <a className="nav-item" href="/dashboard"><span>▤</span>{isApplicant ? ' My applications' : ' Review queue'}</a>
          <a className="nav-item" href="/dashboard"><span>◌</span> Documents</a>
        </nav>
        <div className="sidebar-footer">
          <div className="help-line"><span>?</span><div><strong>Need a hand?</strong><small>Visit the help centre</small></div></div>
          <button className="user-card" onClick={logout}><span className="avatar">{user?.name?.[0] || 'U'}</span><span><strong>{user?.name || 'User'}</strong><small>{user?.role}</small></span><b>↗</b></button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Overview</div><div className="topbar-actions"><span className="date-label">September 27, 2026</span><button className="icon-button" aria-label="Notifications">♧<i /></button></div></header>
        <div className="dashboard-content">
          <section className="welcome-row"><div><p className="eyebrow">Good morning, {user?.name?.split(' ')[0] || 'there'}</p><h1>{isApplicant ? 'Your loan journey, at a glance.' : 'Keep your lending queue moving.'}</h1><p className="subheading">Here is what needs your attention today.</p></div><button className="primary-button compact">{isApplicant ? '＋ New application' : 'View review queue'}<span>→</span></button></section>
          <section className="summary-grid">{summaries.map((item) => <article className="summary-tile" key={item.label}><div className={`tile-icon ${item.tone}`} /> <p>{item.label}</p><strong>{item.value}</strong><small>{item.detail}</small></article>)}</section>
          <section className="work-area"><div className="section-heading"><div><p className="eyebrow">Recent activity</p><h2>{isApplicant ? 'Your applications' : 'Applications in your queue'}</h2></div><button className="text-button">View all <span>→</span></button></div><div className="table-wrap"><table><thead><tr><th>Application</th><th>Purpose</th><th>Amount</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>{applications.map((application) => <tr key={application.id}><td><strong>{application.id}</strong><small>{application.borrower}</small></td><td>{application.purpose}</td><td className="amount">{application.amount}</td><td><span className={`status status-${application.status.toLowerCase().replaceAll(' ', '-')}`}>{application.status}</span></td><td>{application.date}</td><td><button className="row-action" aria-label={`Open ${application.id}`}>→</button></td></tr>)}</tbody></table></div></section>
          <section className="insight-band"><div className="insight-mark">✦</div><div><p className="eyebrow">A small nudge</p><h2>Clear next steps make better decisions.</h2><p>Applications with complete documents move through verification 31% faster.</p></div><button className="outline-button">Check documents <span>→</span></button></section>
        </div>
      </main>
    </div>
  )
}

export default App
