import { useDocumentViewer } from '../hooks/useDocumentViewer'
import { formatDocumentType } from '../constants'
import Icon from '../../../shared/components/Icon'

function DocumentList({ documents, canVerify = false, onVerify, pendingAction }) {
  const { openDocument, openingId, error } = useDocumentViewer()

  if (!documents.length) {
    return <p className="muted">No documents uploaded.</p>
  }

  return (
    <>
      {error && <p className="alert alert-error" role="alert">{error}</p>}
      <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Status</th>
            <th>File</th>
            {canVerify && <th>Verification</th>}
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td><span className="doc-name"><span className="doc-icon"><Icon name="file" size={16} /></span>{formatDocumentType(document.doc_type)}</span></td>
              <td>
                <span className={`pill ${document.verified ? 'pill-approved' : 'pill-submitted'}`}>
                  {document.verified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td>
                <button type="button" className="link-button link-icon" onClick={() => openDocument(document.id)} disabled={openingId === document.id}>
                  <Icon name="eye" size={15} />{openingId === document.id ? 'Opening…' : 'View'}
                </button>
              </td>
              {canVerify && (
                <td>
                  <button
                    type="button"
                    className="button button-small"
                    onClick={() => onVerify(document.id, !document.verified)}
                    disabled={Boolean(pendingAction)}
                  >
                    {pendingAction === `document-${document.id}`
                      ? 'Saving…'
                      : document.verified ? 'Mark unverified' : 'Mark verified'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  )
}

export default DocumentList
