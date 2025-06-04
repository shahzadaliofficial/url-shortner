import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import EmailVerificationComponent from '../components/EmailVerificationComponent'
import ThemeToggle from '../components/ThemeToggle'
import FormInput from '../components/FormInput'
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateConfirmPassword,
  validateEmailDeliverabilityAsync 
} from '../utils/validation'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationRequired, setVerificationRequired] = useState(false)
  const [emailDeliverable, setEmailDeliverable] = useState(true)
  const [checkingEmail, setCheckingEmail] = useState(false)
  
  const navigate = useNavigate()
  const { checkAuthStatus } = useAuth()

  // Validation states
  const [nameValidation, setNameValidation] = useState({ isValid: true, errors: [] })
  const [emailValidation, setEmailValidation] = useState({ isValid: true, errors: [] })
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, errors: [], strength: 'weak', score: 0 })
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({ isValid: true, errors: [] })

  // Real-time validation
  useEffect(() => {
    setNameValidation(validateName(name))
  }, [name])

  useEffect(() => {
    if (!email) {
      setEmailValidation({ isValid: true, errors: [] })
      setEmailDeliverable(true)
      setCheckingEmail(false)
      return
    }

    // Start with basic format validation
    const basicValidation = validateEmail(email)
    setEmailValidation(basicValidation)
    
    // Check email deliverability for valid emails
    if (basicValidation.isValid) {
      setCheckingEmail(true)
      const checkDeliverability = async () => {
        try {
          const deliverabilityResult = await validateEmailDeliverabilityAsync(email)
          
          // Update validation with deliverability results
          setEmailValidation({
            isValid: deliverabilityResult.isValid,
            errors: deliverabilityResult.errors,
            isDeliverable: deliverabilityResult.isDeliverable
          })
          setEmailDeliverable(deliverabilityResult.isDeliverable)
          
        } catch (error) {
          console.warn('Email deliverability check failed:', error)
          // Keep basic validation, but show warning
          setEmailDeliverable(null) // Unknown
        } finally {
          setCheckingEmail(false)
        }
      }
      
      const timeoutId = setTimeout(checkDeliverability, 800) // Debounce for 800ms - more responsive
      return () => clearTimeout(timeoutId)
    } else {
      setEmailDeliverable(true)
      setCheckingEmail(false)
    }
  }, [email])

  useEffect(() => {
    setPasswordValidation(validatePassword(password))
  }, [password])

  useEffect(() => {
    setConfirmPasswordValidation(validateConfirmPassword(password, confirmPassword))
  }, [password, confirmPassword])

  // Check if form is valid
  const isFormValid = nameValidation.isValid && 
                      emailValidation.isValid && 
                      passwordValidation.isValid && 
                      confirmPasswordValidation.isValid &&
                      name && email && password && confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Final validation check
    if (!isFormValid) {
      setError('Please fix all validation errors before submitting')
      setLoading(false)
      return
    }

    try {
      const response = await registerUser(name, email, password)
      
      // Always show verification component for new registrations
      // Modern registration flow requires email verification
      setVerificationRequired(true)
    } catch (error) {
      setError(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      {verificationRequired ? (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <EmailVerificationComponent 
            email={email} 
            onClose={() => setVerificationRequired(false)}
          />
        </div>
      ) : (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <FormInput
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={setName}
                  validation={nameValidation}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required={true}
                />

                <div className="space-y-1">
                  <FormInput
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    validation={emailValidation}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required={true}
                  />
                  
                  {/* Email validation status */}
                  {email && (
                    <div className="flex items-center space-x-2 mt-2">
                      {checkingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Checking email...</span>
                        </>
                      ) : emailValidation.isValid ? (
                        <>
                          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-green-600 dark:text-green-400">Valid email</span>
                        </>
                      ) : !emailValidation.isValid && emailValidation.errors.length > 0 ? (
                        <>
                          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-xs text-red-600 dark:text-red-400">Invalid email</span>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>

                <FormInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  validation={passwordValidation}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required={true}
                  showStrength={true}
                />

                <FormInput
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  validation={confirmPasswordValidation}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required={true}
                />

                {/* Password Requirements */}
                {password && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</h4>
                    <ul className="text-xs space-y-1">
                      <li className={`flex items-center space-x-2 ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>{password.length >= 8 ? '✓' : '○'}</span>
                        <span>At least 8 characters</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                        <span>One uppercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                        <span>One lowercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${/\d/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>{/\d/.test(password) ? '✓' : '○'}</span>
                        <span>One number</span>
                      </li>
                      <li className={`flex items-center space-x-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        <span>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}</span>
                        <span>One special character</span>
                      </li>
                    </ul>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Show warning if email is not deliverable */}
                {email && emailValidation.isValid && emailDeliverable === false && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      ⚠️ This email address cannot receive emails. Please use a different email address to continue.
                    </p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid || checkingEmail}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? 'Creating account...' : checkingEmail ? 'Verifying email...' : 'Create account'}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                    Back to Home
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Register