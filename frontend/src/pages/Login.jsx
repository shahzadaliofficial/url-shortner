import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, resendVerification } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import EmailVerificationComponent from '../components/EmailVerificationComponent'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  
  const navigate = useNavigate()
  const { login, checkAuthStatus } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowVerificationModal(false)

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
        setShowVerificationModal(true)
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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

            {error && !showVerificationModal && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {showVerificationModal && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800 text-sm">
                  <p className="font-medium">Email not verified</p>
                  <p className="mt-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    📨 Resend Verification Email
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
      
      {/* Email Verification Modal */}
      {showVerificationModal && (
        <EmailVerificationComponent 
          email={email}
          showAsModal={true}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </>
  )
}

export default Login
