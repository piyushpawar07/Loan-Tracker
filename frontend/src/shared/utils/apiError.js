export function getErrorMessage(error, fallback) {
  if (error.response?.data?.message) return error.response.data.message
  if (error.request && !error.response) return 'Cannot reach the server. Check that the backend is running.'
  return fallback
}

export function getFieldErrors(error) {
  const errors = error.response?.data?.data?.errors
  if (!Array.isArray(errors)) return {}
  return Object.fromEntries(errors.map((item) => [item.field, item.message]))
}
