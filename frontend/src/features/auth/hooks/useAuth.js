import { useState } from 'react'
import * as authApi from '../api/auth.api'
import { getErrorMessage, getFieldErrors } from '../../../shared/utils/apiError'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function request(call, fallback) {
    setLoading(true)
    setError('')
    setFieldErrors({})
    try {
      return await call()
    } catch (requestError) {
      setError(getErrorMessage(requestError, fallback))
      setFieldErrors(getFieldErrors(requestError))
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  function login(credentials) {
    return request(() => authApi.login(credentials), 'Sign in failed. Please try again.')
  }

  function register(details) {
    return request(() => authApi.register(details), 'Registration failed. Please try again.')
  }

  function clearErrors() {
    setError('')
    setFieldErrors({})
  }

  return { login, register, loading, error, fieldErrors, clearErrors }
}
