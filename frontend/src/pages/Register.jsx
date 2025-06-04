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
  isEmailDeliverable 
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
    const validation = validateEmail(email)
    setEmailValidation(validation)
    
    // Check email deliverability for valid emails
    if (validation.isValid && email) {
      setCheckingEmail(true)
      const checkDeliverability = async () => {
        try {
          const deliverable = await isEmailDeliverable(email)
          setEmailDeliverable(deliverable)
        } catch (error) {
          console.warn('Email deliverability check failed:', error)
          setEmailDeliverable(true) // Fail open
        } finally {
          setCheckingEmail(false)
        }
      }
      
      const timeoutId = setTimeout(checkDeliverability, 500) // Debounce
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
                      emailDeliverable &&
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

    if (!emailDeliverable) {
      setError('The email address provided may not be deliverable. Please check and try again.')
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
                  
                  {/* Email deliverability status */}
                  {email && emailValidation.isValid && (
                    <div className="flex items-center space-x-2 mt-2">
                      {checkingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Checking email...</span>
                        </>
                      ) : emailDeliverable ? (
                        <>
                          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-green-600 dark:text-green-400">Email address looks good</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">Email may not be deliverable</span>
                        </>
                      )}
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

                <div>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? 'Creating account...' : 'Create account'}
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