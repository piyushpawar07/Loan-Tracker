import apiClient from '../../../shared/api/apiClient'

export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data
}

export async function register(details) {
  const response = await apiClient.post('/auth/register', details)
  return response.data
}

export async function logout() {
  const response = await apiClient.post('/auth/logout')
  return response.data
}
