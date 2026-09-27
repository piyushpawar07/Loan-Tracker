import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../state/useAuthContext'
import './Auth.scss'

function Register() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useAuthContext()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'applicant' })
  const [validationError, setValidationError] = useState('')

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
    setValidationError('')
    clearError()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name || !form.email || form.password.length < 8) {
      setValidationError('Add your name, a valid email, and a password of at least 8 characters.')
      return
    }

    try {
      await register(form)
      navigate('/login', { state: { registered: true } })
    } catch {
      // The hook exposes the API message for the form.
    }
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-intro">
        <div className="brand-mark">LT</div>
        <p className="eyebrow">Loan Tracker / 02</p>
        <h1>Start with a better view of your loan.</h1>
        <p className="intro-copy">
          Create your account and keep documents, decisions, and next steps in one calm place.
        </p>
        <div className="process-list">
          <span><b>01</b> Submit an application</span>
          <span><b>02</b> Follow verification</span>
          <span><b>03</b> Track the decision</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="form-heading">
          <p className="eyebrow">Get started</p>
          <h2>Create your workspace</h2>
          <p>Your role determines the applications you can access.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Full name
            <input name="name" value={form.name} onChange={updateField} placeholder="Alex Morgan" />
          </label>
          <label>
            Email address
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={updateField} placeholder="At least 8 characters" />
          </label>
          <label>
            Account role
            <select name="role" value={form.role} onChange={updateField}>
              <option value="applicant">Applicant</option>
              <option value="verifier">Verifier</option>
              <option value="approver">Approver</option>
            </select>
          </label>
          {(validationError || error) && <p className="form-error">{validationError || error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="form-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}

export default Register
