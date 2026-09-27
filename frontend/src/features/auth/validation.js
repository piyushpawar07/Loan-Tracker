const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
  if (!email.trim()) return 'Email is required'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Email must be a valid email address'
  return ''
}

export function validateLogin({ email, password }) {
  const errors = {}
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  if (!password) errors.password = 'Password is required'
  return errors
}

export function validateRegistration({ name, email, password, role }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required'
  else if (name.trim().length > 100) errors.name = 'Name must be at most 100 characters'
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  if (password.length < 8) errors.password = 'Password must be at least 8 characters'
  else if (new TextEncoder().encode(password).length > 72) errors.password = 'Password must be at most 72 bytes'
  if (!role) errors.role = 'Role is required'
  return errors
}
