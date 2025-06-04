import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import FormInput from '../components/FormInput'
import { validatePassword } from '../utils/validation'
import ThemeToggle from '../components/ThemeToggle'
import LoadingSpinner from '../components/LoadingSpinner'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  const token = searchParams.get('token')

  // Validation states
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, errors: [] })

  // Real-time password validation
  useEffect(() => {
    if (newPassword) {
      setPasswordValidation(validatePassword(newPassword))
    } else {
      setPasswordValidation({ isValid: true, errors: [] })
    }
  }, [newPassword])

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setTokenValid(false)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!passwordValidation.isValid) {
      setError('Please enter a valid password')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await resetPassword(token, newPassword)
      setSuccess(true)
      
      // Auto login after successful reset
      setTimeout(() => {
        if (response.data?.user) {
          login(response.data.user)
        }
        navigate('/dashboard')
      }, 2000)
      
    } catch (error) {
      if (error.message.includes('invalid') || error.message.includes('expired')) {
        setTokenValid(false)
      }
      setError(error.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = newPassword && confirmPassword && passwordValidation.isValid && newPassword === confirmPassword

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Invalid Reset Link
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/forgot-password"
                  className="block w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Request New Reset Link
                </Link>
                
                <Link
                  to="/login"
                  className="block w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm"
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

  if (loading && !success) {
    return <LoadingSpinner message="Resetting your password..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {success ? 'Password Reset Successful' : 'Create New Password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {success 
            ? 'You\'ll be redirected to your dashboard shortly'
            : 'Enter your new password below'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Password Reset Complete!
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your password has been successfully reset. You're now logged in and will be redirected to your dashboard.
              </p>
              
              <LoadingSpinner message="Redirecting to dashboard..." />
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInput
                label="New Password"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                validation={passwordValidation}
                placeholder="Enter your new password"
              />

              <FormInput
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                validation={
                  confirmPassword && newPassword !== confirmPassword
                    ? { isValid: false, errors: ['Passwords do not match'] }
                    : { isValid: true, errors: [] }
                }
              />

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
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
