import { useState } from 'react'
import { uploadDocument } from '../api/document.api'
import { getErrorMessage } from '../../../shared/utils/apiError'

export function useDocumentUpload(loanId) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function upload(file, docType) {
    setLoading(true)
    setError('')
    try {
      const result = await uploadDocument(loanId, file, docType)
      return result.data?.document || null
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to upload this document.'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading, error, clearError: () => setError('') }
}
