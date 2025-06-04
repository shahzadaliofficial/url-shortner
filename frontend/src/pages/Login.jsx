import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, resendVerification } from '../api/auth.api'
import { useAuth } from '../contexts/AuthContext'
import EmailVerificationComponent from '../components/EmailVerificationComponent'
import ThemeToggle from '../components/ThemeToggle'
import FormInput from '../components/FormInput'
import { validateEmail } from '../utils/validation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  
  const navigate = useNavigate()
  const { login, checkAuthStatus } = useAuth()

  // Validation states
  const [emailValidation, setEmailValidation] = useState({ isValid: true, errors: [] })

  // Real-time email validation
  useEffect(() => {
    if (email) {
      setEmailValidation(validateEmail(email))
    } else {
      setEmailValidation({ isValid: true, errors: [] })
    }
  }, [email])

  const isFormValid = email && password && emailValidation.isValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowVerificationModal(false)

    // Basic validation
    if (!isFormValid) {
      setError('Please enter a valid email and password')
      setLoading(false)
      return
    }

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors duration-200">
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

            <FormInput
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
            />

            {error && !showVerificationModal && (
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}

            {showVerificationModal && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="text-red-800 dark:text-red-200 text-sm">
                  <p className="font-medium">Email not verified</p>
                  <p className="mt-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(true)}
                    className="mt-2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  >
                    📨 Resend Verification Email
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="flex items-center justify-between text-center">
              <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Forgot your password?
              </Link>
              <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Back to Home
              </Link>
            </div>
          </form>
        </div>
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
