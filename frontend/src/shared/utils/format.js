const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatINR(amount) {
  return inrFormatter.format(Number(amount))
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value))
}

export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value))
}

export function formatShortId(id) {
  return id.slice(0, 8).toUpperCase()
}
