import { useState } from 'react'
import { createLoan } from '../api/loan.api'
import { validateLoan } from '../validation'
import { getErrorMessage, getFieldErrors } from '../../../shared/utils/apiError'

export function useNewLoan() {
  const [form, setForm] = useState({ amount: '', purpose: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setFieldErrors({ ...fieldErrors, [name]: '' })
    setError('')
  }

  async function submit() {
    const validationErrors = validateLoan(form)
    setFieldErrors(validationErrors)
    if (Object.keys(validationErrors).length) return null

    setLoading(true)
    setError('')
    try {
      const result = await createLoan({ amount: Number(form.amount), purpose: form.purpose.trim() })
      return result.data.loan
    } catch (requestError) {
      const serverFieldErrors = getFieldErrors(requestError)
      setFieldErrors(serverFieldErrors)
      if (!Object.keys(serverFieldErrors).length) {
        setError(getErrorMessage(requestError, 'Unable to create this loan.'))
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return { form, updateField, submit, loading, error, fieldErrors }
}
