// Email validation utility
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors = []

  if (!email) {
    errors.push('Email is required')
    return { isValid: false, errors }
  }

  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address')
  }

  // Check for common email format issues
  if (email.includes('..')) {
    errors.push('Email cannot contain consecutive dots')
  }

  if (email.startsWith('.') || email.endsWith('.')) {
    errors.push('Email cannot start or end with a dot')
  }

  // Check for minimum domain length
  const parts = email.split('@')
  if (parts.length === 2) {
    const domain = parts[1]
    if (domain.length < 3) {
      errors.push('Domain name too short')
    }
    
    // Check for valid TLD
    const domainParts = domain.split('.')
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      errors.push('Invalid domain extension')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Password validation utility
export const validatePassword = (password) => {
  const errors = []
  const minLength = 8
  const maxLength = 128

  if (!password) {
    errors.push('Password is required')
    return { isValid: false, errors, strength: 'weak' }
  }

  // Length validation
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`)
  }

  if (password.length > maxLength) {
    errors.push(`Password must be less than ${maxLength} characters`)
  }

  // Character requirements
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!hasNumbers) {
    errors.push('Password must contain at least one number')
  }

  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  }

  // Common password patterns to avoid
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /letmein/i
  ]

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password contains common patterns and is not secure')
      break
    }
  }

  // Calculate password strength
  let strengthScore = 0
  if (password.length >= 8) strengthScore += 1
  if (password.length >= 12) strengthScore += 1
  if (hasUpperCase) strengthScore += 1
  if (hasLowerCase) strengthScore += 1
  if (hasNumbers) strengthScore += 1
  if (hasSpecialChar) strengthScore += 1
  if (password.length >= 16) strengthScore += 1

  let strength = 'weak'
  if (strengthScore >= 6) strength = 'strong'
  else if (strengthScore >= 4) strength = 'medium'

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: strengthScore
  }
}

// Name validation utility
export const validateName = (name) => {
  const errors = []

  if (!name) {
    errors.push('Name is required')
    return { isValid: false, errors }
  }

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  if (name.length > 50) {
    errors.push('Name must be less than 50 characters')
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(name)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes')
  }

  // Check for consecutive spaces
  if (/\s{2,}/.test(name)) {
    errors.push('Name cannot contain consecutive spaces')
  }

  // Check if name starts or ends with space
  if (name.startsWith(' ') || name.endsWith(' ')) {
    errors.push('Name cannot start or end with a space')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = []

  if (!confirmPassword) {
    errors.push('Please confirm your password')
    return { isValid: false, errors }
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Real-time email validation for better UX
export const isEmailDeliverable = async (email) => {
  // Basic format check first
  const { isValid } = validateEmail(email)
  if (!isValid) return false

  try {
    // Check if domain has MX record (simplified client-side check)
    const domain = email.split('@')[1]
    
    // List of known valid domains (you can extend this)
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'icloud.com', 'protonmail.com', 'aol.com', 'live.com',
      'msn.com', 'yandex.com', 'mail.com', 'zoho.com'
    ]

    // If it's a common domain, assume it's deliverable
    if (commonDomains.includes(domain.toLowerCase())) {
      return true
    }

    // For other domains, we'll assume they're valid if they pass format validation
    // In a real application, you might want to use a backend service to check MX records
    return true
  } catch (error) {
    console.warn('Email deliverability check failed:', error)
    return true // Fail open - assume email is deliverable
  }
}
