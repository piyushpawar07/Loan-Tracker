import apiClient from '../../../shared/api/apiClient'

export async function createLoan(details) {
  const response = await apiClient.post('/loans', details)
  return response.data
}

export async function fetchLoans() {
  const response = await apiClient.get('/loans')
  return response.data
}

export async function fetchLoanById(loanId) {
  const response = await apiClient.get(`/loans/${loanId}`)
  return response.data
}

export async function fetchLoanHistory(loanId) {
  const response = await apiClient.get(`/loans/${loanId}/history`)
  return response.data
}

export async function updateLoanStatus(loanId, status) {
  const response = await apiClient.patch(`/loans/${loanId}/status`, { status })
  return response.data
}
