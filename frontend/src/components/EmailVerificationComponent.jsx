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
    ? "bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
    : "bg-blue-50 border border-blue-200 rounded-lg p-6"

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📧 Email Verification Required
          </h3>
          {showAsModal && onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            We've sent a verification email to <strong>{email}</strong>
          </p>
          
          <p className="text-sm text-gray-500">
            Please check your inbox and click the verification link to activate your account.
          </p>

          {message && (
            <div className={`p-3 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '📤 Sending...' : '📨 Resend Verification Email'}
            </button>
            
            {!showAsModal && onClose && (
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>Didn't receive the email? Check your spam folder or try resending.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationComponent
