import React, { useState } from 'react'
import { resendVerification } from '../api/auth.api'
import { Link } from 'react-router-dom'

const EmailVerificationRequired = ({ email, onResend }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleResendVerification = async () => {
    try {
      setLoading(true)
      setError('')
      
      await resendVerification(email)
      setSuccess(true)
      
      if (onResend) {
        onResend()
      }
      
      setTimeout(() => setSuccess(false), 5000)
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
          <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Please check your email and click the verification link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Check Your Inbox
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We've sent a verification email to:
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                {email}
              </p>
            </div>

            <div className="mb-6 text-left">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                What to do next:
              </h4>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>1. Check your email inbox</li>
                <li>2. Look for an email from URL Shortener</li>
                <li>3. Click the verification link in the email</li>
                <li>4. You'll be redirected back and logged in automatically</li>
              </ol>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Didn't receive the email? Check your spam folder or:
              </p>
              
              <button
                onClick={handleResendVerification}
                disabled={loading || success}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 mb-4 transition-colors duration-200"
              >
                {loading ? 'Sending...' : success ? 'Email Sent!' : 'Resend Verification Email'}
              </button>

              {success && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Verification email sent successfully! Please check your inbox.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Link 
                to="/login" 
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationRequired
