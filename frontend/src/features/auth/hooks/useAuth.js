import { useState } from 'react'
import * as authApi from '../api/auth.api'

function getErrorMessage(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(credentials) {
    setLoading(true)
    setError('')
    try {
      const result = await authApi.login(credentials)
      return result
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  async function register(details) {
    setLoading(true)
    setError('')
    try {
      const result = await authApi.register(details)
      return result
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      setError(message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return { login, register, loading, error, clearError: () => setError('') }
}
