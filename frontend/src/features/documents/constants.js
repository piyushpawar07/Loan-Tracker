export const DOCUMENT_TYPES = [
  { value: 'identity', label: 'Identity proof' },
  { value: 'income', label: 'Income proof' },
  { value: 'address', label: 'Address proof' },
]

export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
export const MAX_FILE_BYTES = 5 * 1024 * 1024

export function formatDocumentType(value) {
  return DOCUMENT_TYPES.find((type) => type.value === value)?.label || value
}
