import apiClient from '../../../shared/api/apiClient'

export async function uploadDocument(loanId, file, docType) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('doc_type', docType)

  const response = await apiClient.post(`/loans/${loanId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export async function verifyDocument(documentId, verified) {
  const response = await apiClient.patch(`/documents/${documentId}/verify`, { verified })
  return response.data
}

export async function fetchDocumentFile(documentId) {
  const response = await apiClient.get(`/documents/${documentId}/file`, { responseType: 'blob' })
  return response.data
}
