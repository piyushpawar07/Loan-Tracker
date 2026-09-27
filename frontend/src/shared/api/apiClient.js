import axios from 'axios'

export const SESSION_EXPIRED_EVENT = 'auth:session-expired'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization)
    const isLogout = error.config?.url === '/auth/logout'
    if (error.response?.status === 401 && sentToken && !isLogout) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, {
        detail: error.response.data?.message,
      }))
    }
    return Promise.reject(error)
  },
)

export default apiClient
