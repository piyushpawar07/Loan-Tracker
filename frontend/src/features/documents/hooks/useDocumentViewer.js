import { useState } from 'react'
import { fetchDocumentFile } from '../api/document.api'
import { getErrorMessage } from '../../../shared/utils/apiError'

async function readBlobError(error) {
  const body = error.response?.data
  if (!(body instanceof Blob)) return error
  try {
    const parsed = JSON.parse(await body.text())
    return { ...error, response: { ...error.response, data: parsed } }
  } catch {
    return error
  }
}

export function useDocumentViewer() {
  const [openingId, setOpeningId] = useState(null)
  const [error, setError] = useState('')

  async function openDocument(documentId) {
    const viewer = window.open('', '_blank')
    setOpeningId(documentId)
    setError('')
    try {
      const file = await fetchDocumentFile(documentId)
      const url = URL.createObjectURL(file)
      if (viewer) viewer.location.href = url
      else window.location.assign(url)
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (requestError) {
      viewer?.close()
      setError(getErrorMessage(await readBlobError(requestError), 'Unable to open this document.'))
    } finally {
      setOpeningId(null)
    }
  }

  return { openDocument, openingId, error }
}
