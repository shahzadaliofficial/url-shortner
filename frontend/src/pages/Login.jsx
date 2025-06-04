import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, resendVerification } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)
  const [verificationLoading, setVerificationLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login, checkAuthStatus } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowVerificationMessage(false)

    try {
      const response = await loginUser(email, password)
      
      // If the response contains user data, use it to update auth state
      if (response.data?.user) {
        login(response.data.user)
      } else {
        // Fallback: refresh auth status from server
        await checkAuthStatus()
      }
      
      navigate('/dashboard')
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      
      // Check if the error is related to email verification
      if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
        setShowVerificationMessage(true)
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setVerificationLoading(true)
    try {
      await resendVerification(email)
      setError('')
      alert('Verification email sent! Please check your inbox.')
    } catch (error) {
      setError(error.message || 'Failed to send verification email')
    } finally {
      setVerificationLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {showVerificationMessage && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="text-yellow-800 text-sm">
                  <p className="font-medium">Email verification required</p>
                  <p className="mt-1">Please check your email and click the verification link to activate your account.</p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={verificationLoading}
                    className="mt-2 text-yellow-600 hover:text-yellow-500 font-medium disabled:opacity-50"
                  >
                    {verificationLoading ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
