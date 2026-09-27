export const MIN_LOAN_AMOUNT = 10000
export const MAX_LOAN_AMOUNT = 10000000
export const MAX_PURPOSE_LENGTH = 200

export function validateLoan({ amount, purpose }) {
  const errors = {}
  const value = Number(amount)

  if (amount === '') errors.amount = 'Amount is required'
  else if (!Number.isFinite(value)) errors.amount = 'Amount must be a number'
  else if (!Number.isInteger(value)) errors.amount = 'Amount must be in whole rupees'
  else if (value < MIN_LOAN_AMOUNT || value > MAX_LOAN_AMOUNT) {
    errors.amount = 'Amount must be between ₹10,000 and ₹1,00,00,000'
  }

  if (!purpose.trim()) errors.purpose = 'Purpose is required'
  else if (purpose.trim().length > MAX_PURPOSE_LENGTH) errors.purpose = `Purpose must be at most ${MAX_PURPOSE_LENGTH} characters`

  return errors
}
