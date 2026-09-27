import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../features/auth/state/useAuthContext'
import Icon from './Icon'

const navByRole = {
  applicant: [
    { to: '/dashboard', label: 'My applications', icon: 'list' },
    { to: '/loans/new', label: 'New application', icon: 'plus' },
  ],
  verifier: [{ to: '/verifier', label: 'Verification queue', icon: 'shield' }],
  approver: [{ to: '/approver', label: 'Approval queue', icon: 'stamp' }],
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U'
}

function AppLayout({ title, subtitle, actions, children }) {
  const { user, logout } = useAuthContext()
  const navItems = navByRole[user?.role] || []

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">₹</span>
          <span className="brand-name">Loan Tracker</span>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="avatar">{initials(user?.name)}</span>
          <span className="sidebar-user-text">
            <strong>{user?.name}</strong>
            <small>{user?.role}</small>
          </span>
          <button type="button" className="icon-button" onClick={logout} aria-label="Sign out" title="Sign out">
            <Icon name="logout" />
          </button>
        </div>
      </aside>
      <main className="content">
        <header className="page-heading">
          <div>
            <h1>{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </header>
        {children}
      </main>
    </div>
  )
}

export default AppLayout
