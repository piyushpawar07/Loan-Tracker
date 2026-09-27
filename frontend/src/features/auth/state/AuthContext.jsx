import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const auth = useAuth()
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  async function login(credentials) {
    const result = await auth.login(credentials)
    setToken(result.data.token)
    setUser(result.data.user)
    localStorage.setItem('token', result.data.token)
    return result
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, user, token }}>
      {children}
    </AuthContext.Provider>
  )
}

