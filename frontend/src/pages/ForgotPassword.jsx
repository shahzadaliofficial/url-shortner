import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth.api'
import FormInput from '../components/FormInput'
import { validateEmail } from '../utils/validation'
import ThemeToggle from '../components/ThemeToggle'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  // Validation states
  const [emailValidation, setEmailValidation] = useState({ isValid: true, errors: [] })

  // Real-time email validation
  React.useEffect(() => {
    if (email) {
      setEmailValidation(validateEmail(email))
    } else {
      setEmailValidation({ isValid: true, errors: [] })
    }
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!emailValidation.isValid) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      await forgotPassword(email)
      setEmailSent(true)
      setMessage('Password reset link sent! Please check your email.')
    } catch (error) {
      setError(error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email && emailValidation.isValid

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {emailSent ? 'Check Your Email' : 'Reset Your Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {emailSent 
            ? 'We\'ve sent you a password reset link'
            : 'Enter your email address and we\'ll send you a reset link'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
          {emailSent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Reset Link Sent
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We've sent a password reset link to:
              </p>
              
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md mb-6">
                {email}
              </p>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>Please check your email and click the reset link to create a new password.</p>
                <p>The link will expire in 1 hour for security reasons.</p>
                <p>Don't see the email? Check your spam folder.</p>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                    setMessage('')
                    setError('')
                  }}
                  className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Send Another Reset Link
                </button>
                
                <Link
                  to="/login"
                  className="block w-full text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInput
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={setEmail}
                validation={emailValidation}
                placeholder="Enter your email address"
              />

              {message && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </button>
              </div>

              <div className="text-center space-y-2">
                <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                  Back to Login
                </Link>
                <div className="text-gray-500 dark:text-gray-400">|</div>
                <Link to="/register" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                  Create an Account
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
