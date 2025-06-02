import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { verifyEmail, resendVerification } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Verifying your email..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Email Verified Successfully!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Welcome to URL Shortener! You'll be redirected to your dashboard shortly.
              </p>
              <LoadingSpinner size="sm" message="Redirecting..." />
            </div>
          ) : token ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {error || 'The verification link is invalid or has expired.'}
              </p>
              <p className="text-sm text-gray-500">
                Need a new verification link? Use the form below.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Resend Verification Email
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Enter your email address to receive a new verification link.
              </p>
            </div>
          )}

          {/* Resend Verification Form */}
          {!success && (
            <form className="mt-6" onSubmit={handleResendVerification}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </form>
          )}

          {/* Success/Error Messages */}
          {resendSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{resendSuccess}</p>
            </div>
          )}

          {error && !success && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 hover:text-blue-500"
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
