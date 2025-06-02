import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import EmailVerificationRequired from './EmailVerificationRequired'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user email is verified
  if (user && user.isEmailVerified === false) {
    return <EmailVerificationRequired email={user.email} />
  }

  return children
}

export default ProtectedRoute
