import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../state/useAuthContext'
import { validateLogin } from '../validation'
import { ROLE_HOME_PATHS } from '../../../shared/constants/roles'
import FormField from '../../../shared/components/FormField'
import AuthLayout from '../components/AuthLayout'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error, fieldErrors, clearErrors, notice, setNotice } = useAuthContext()
  const [form, setForm] = useState({ email: '', password: '' })
  const [clientErrors, setClientErrors] = useState({})
  const errors = { ...fieldErrors, ...clientErrors }
  const justRegistered = location.state?.registered

  function updateField(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setClientErrors({ ...clientErrors, [name]: '' })
    clearErrors()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateLogin(form)
    setClientErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    try {
      const result = await login({ ...form, email: form.email.trim() })
      const fallback = location.state?.from?.pathname || '/dashboard'
      navigate(ROLE_HOME_PATHS[result.data.user.role] || fallback, { replace: true })
    } catch {
      return
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back. Enter your details to continue.">
      {justRegistered && !notice && <p className="alert alert-success">Account created. Sign in to continue.</p>}
      {notice && <p className="alert alert-info">{notice} <button type="button" className="link-button" onClick={() => setNotice('')}>Dismiss</button></p>}
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password}>
          <input id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={updateField} aria-invalid={Boolean(errors.password)} />
        </FormField>
        {error && !Object.keys(fieldErrors).length && <p className="alert alert-error" role="alert">{error}</p>}
        <button className="button button-primary button-block" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="form-footer">No account? <Link to="/register">Register</Link></p>
    </AuthLayout>
  )
}

export default Login
