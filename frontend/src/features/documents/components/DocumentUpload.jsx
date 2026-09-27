import { useRef, useState } from 'react'
import { useDocumentUpload } from '../hooks/useDocumentUpload'
import { ALLOWED_FILE_TYPES, DOCUMENT_TYPES, MAX_FILE_BYTES, formatDocumentType } from '../constants'
import FormField from '../../../shared/components/FormField'
import Icon from '../../../shared/components/Icon'

function validateFile(file) {
  if (!file) return 'Choose a file to upload'
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return 'Only PDF, JPG, and PNG files are allowed'
  if (file.size > MAX_FILE_BYTES) return 'File must be 5MB or smaller'
  return ''
}

function DocumentUpload({ loanId, onUploaded }) {
  const inputRef = useRef(null)
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0].value)
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [lastUploaded, setLastUploaded] = useState('')
  const { upload, loading, error, clearError } = useDocumentUpload(loanId)

  function chooseFile(event) {
    const chosen = event.target.files[0] || null
    setFile(chosen)
    setFileError(chosen ? validateFile(chosen) : '')
    setLastUploaded('')
    clearError()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationError = validateFile(file)
    setFileError(validationError)
    if (validationError) return

    const document = await upload(file, docType)
    if (!document) return
    setLastUploaded(formatDocumentType(document.doc_type))
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
    onUploaded()
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit} noValidate>
      <FormField id="doc-type" label="Document type">
        <select id="doc-type" value={docType} onChange={(event) => setDocType(event.target.value)}>
          {DOCUMENT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
        </select>
      </FormField>
      <FormField id="doc-file" label="File" error={fileError} hint="PDF, JPG, or PNG, up to 5MB">
        <input id="doc-file" ref={inputRef} type="file" accept={ALLOWED_FILE_TYPES.join(',')} onChange={chooseFile} aria-invalid={Boolean(fileError)} />
      </FormField>
      <div className="upload-actions">
        <button className="button button-primary" type="submit" disabled={loading}>
          <Icon name="upload" size={16} />{loading ? 'Uploading…' : 'Upload document'}
        </button>
      </div>
      {error && <p className="alert alert-error upload-message" role="alert">{error}</p>}
      {lastUploaded && <p className="alert alert-success upload-message">{lastUploaded} uploaded.</p>}
    </form>
  )
}

export default DocumentUpload
