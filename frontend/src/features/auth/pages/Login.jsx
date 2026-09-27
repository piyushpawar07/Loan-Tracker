import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../state/useAuthContext'
import './Auth.scss'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, clearError } = useAuthContext()
  const [form, setForm] = useState({ email: '', password: '' })
  const [validationError, setValidationError] = useState('')

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setValidationError('')
    clearError()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.email || !form.password) {
      setValidationError('Enter your email and password to continue.')
      return
    }

    try {
      await login(form)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch {
      // The hook exposes the API message for the form.
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand-mark">LT</div>
        <p className="eyebrow">Loan Tracker / 01</p>
        <h1>Keep every application moving.</h1>
        <p className="intro-copy">
          A clear workspace for applicants and lending teams to review, verify,
          and progress each loan with confidence.
        </p>
        <div className="intro-note">
          <span className="note-dot" />
          <span>Secure workspace for your lending workflow</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="form-heading">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p>Use the email connected to your Loan Tracker account.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Email address
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={updateField} placeholder="Enter your password" />
          </label>
          {(validationError || error) && <p className="form-error">{validationError || error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="form-switch">New to Loan Tracker? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}

export default Login
