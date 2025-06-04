import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { verifyEmail, resendVerification } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ThemeToggle from '../components/ThemeToggle'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState('')
  const [email, setEmail] = useState('')
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      handleVerification(token)
    }
  }, [token])

  const handleVerification = async (verificationToken) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await verifyEmail(verificationToken)
      
      setSuccess(true)
      
      // Auto login after successful verification
      setTimeout(() => {
        login(response.data.user)
        navigate('/dashboard')
      }, 2000)
      
    } catch (error) {
      setError(error.response?.data?.message || 'Email verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    try {
      setResendLoading(true)
      setError('')
      setResendSuccess('')
      
      await resendVerification(email)
      setResendSuccess('Verification email sent! Please check your inbox.')
      setEmail('')
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setResendLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <LoadingSpinner message="Verifying your email..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
          
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Email Verified Successfully!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Welcome to URL Shortener! You'll be redirected to your dashboard shortly.
              </p>
              <LoadingSpinner size="sm" message="Redirecting..." />
            </div>
          ) : token ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need a new verification link? Use the form below.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                Resend Verification Email
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
                Enter your email address to receive a new verification link.
              </p>
            </div>
          )}

          {/* Resend Verification Form */}
          {!success && (
            <form className="mt-6" onSubmit={handleResendVerification}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </form>
          )}

          {/* Success/Error Messages */}
          {resendSuccess && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400">{resendSuccess}</p>
            </div>
          )}

          {error && !success && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
