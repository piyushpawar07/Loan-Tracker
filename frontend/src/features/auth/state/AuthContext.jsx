import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import * as authApi from '../api/auth.api'
import { SESSION_EXPIRED_EVENT } from '../../../shared/api/apiClient'
import { AuthContext } from './authContext'

function readSavedUser() {
  try {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const auth = useAuth()
  const [user, setUser] = useState(readSavedUser)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [notice, setNotice] = useState('')

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  useEffect(() => {
    function handleSessionExpired(event) {
      clearSession()
      setNotice(event.detail || 'Your session has ended. Please sign in again.')
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [clearSession])

  async function login(credentials) {
    const result = await auth.login(credentials)
    localStorage.setItem('token', result.data.token)
    localStorage.setItem('user', JSON.stringify(result.data.user))
    setToken(result.data.token)
    setUser(result.data.user)
    setNotice('')
    return result
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      setNotice('Signed out on this device, but the server could not revoke the session token.')
    }
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, user, token, notice, setNotice }}>
      {children}
    </AuthContext.Provider>
  )
}
