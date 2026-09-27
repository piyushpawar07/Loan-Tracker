import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../state/useAuthContext'
import { validateRegistration } from '../validation'
import FormField from '../../../shared/components/FormField'
import AuthLayout from '../components/AuthLayout'

function Register() {
  const navigate = useNavigate()
  const { register, loading, error, fieldErrors, clearErrors } = useAuthContext()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'applicant' })
  const [clientErrors, setClientErrors] = useState({})
  const errors = { ...fieldErrors, ...clientErrors }

  function updateField(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setClientErrors({ ...clientErrors, [name]: '' })
    clearErrors()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateRegistration(form)
    setClientErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() })
      navigate('/login', { state: { registered: true } })
    } catch {
      return
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Choose a role to try its part of the workflow.">
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="name" label="Full name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" value={form.name} onChange={updateField} aria-invalid={Boolean(errors.name)} />
        </FormField>
        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} aria-invalid={Boolean(errors.email)} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password} hint="8 to 72 characters">
          <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={updateField} aria-invalid={Boolean(errors.password)} />
        </FormField>
        <FormField
          id="role"
          label="Role"
          error={errors.role}
          hint="Demo only: roles are self-selected so each workflow can be tried. In production, verifier and approver accounts would be created by an administrator."
        >
          <select id="role" name="role" value={form.role} onChange={updateField}>
            <option value="applicant">Applicant</option>
            <option value="verifier">Verifier</option>
            <option value="approver">Approver</option>
          </select>
        </FormField>
        {error && !Object.keys(fieldErrors).length && <p className="alert alert-error" role="alert">{error}</p>}
        <button className="button button-primary button-block" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="form-footer">Already registered? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  )
}

export default Register
