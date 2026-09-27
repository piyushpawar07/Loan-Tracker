import Icon from '../../../shared/components/Icon'

const steps = [
  { icon: 'file', title: 'Apply', text: 'Applicants submit a loan request and upload proof documents.' },
  { icon: 'shield', title: 'Verify', text: 'Verifiers check every document before the loan moves on.' },
  { icon: 'stamp', title: 'Approve & disburse', text: 'Approvers make the final call and confirm the payout.' },
]

function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth">
      <section className="auth-brand">
        <div className="brand">
          <span className="brand-mark">₹</span>
          <span className="brand-name">Loan Tracker</span>
        </div>
        <div className="auth-pitch">
          <h1>Every loan, from application to disbursement.</h1>
          <p>One shared record for applicants, verifiers and approvers, with a full audit trail at every step.</p>
        </div>
        <ol className="auth-steps">
          {steps.map((step) => (
            <li key={step.title}>
              <span className="auth-step-icon"><Icon name={step.icon} size={18} /></span>
              <span>
                <strong>{step.title}</strong>
                <small>{step.text}</small>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="auth-form-side">
        <div className="auth-card">
          <h2>{title}</h2>
          <p className="muted auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
