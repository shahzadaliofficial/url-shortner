import React, { useState } from 'react'
import { resendVerificationEmail } from '../api/auth.api'

const EmailVerificationComponent = ({ email, onClose, showAsModal = false }) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const handleResendEmail = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      await resendVerificationEmail(email)
      setMessage('Verification email sent successfully! Please check your inbox.')
      setMessageType('success')
    } catch (error) {
      setMessage(error.message || 'Failed to send verification email')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const containerClass = showAsModal 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    : "w-full"

  const contentClass = showAsModal
    ? "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors duration-200"
    : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors duration-200"

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            📧 Email Verification Required
          </h3>
          {showAsModal && onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl transition-colors duration-200"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please check your inbox and click the verification link to activate your account.
          </p>

          {message && (
            <div className={`p-3 rounded-md transition-colors duration-200 ${
              messageType === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? '📤 Sending...' : '📨 Resend Verification Email'}
            </button>
            
            {!showAsModal && onClose && (
              <button
                onClick={onClose}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Didn't receive the email? Check your spam folder or try resending.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationComponent
