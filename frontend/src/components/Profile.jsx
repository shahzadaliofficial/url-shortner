import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile, changePassword } from '../api/auth.api'
import FormInput from './FormInput'
import { validatePassword } from '../utils/validation'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Profile form states
  const [name, setName] = useState(user?.name || '')

  // Password form states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation states
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, errors: [] })

  // Real-time validation for password only

  React.useEffect(() => {
    if (newPassword) {
      setPasswordValidation(validatePassword(newPassword))
    } else {
      setPasswordValidation({ isValid: true, errors: [] })
    }
  }, [newPassword])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await updateProfile({ name })
      updateUser(response.data.user)
      setMessage('Profile updated successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!passwordValidation.isValid) {
      setError('Please enter a valid password')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    try {
      await changePassword({
        currentPassword,
        newPassword
      })
      setMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setError(error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const isProfileFormValid = name.trim()
  const isPasswordFormValid = currentPassword && newPassword && confirmPassword && passwordValidation.isValid && newPassword === confirmPassword

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">
          Account Settings
        </h2>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Change Password
            </button>
          </nav>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {user?.email}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !isProfileFormValid}
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <FormInput
              label="Current Password"
              type="password"
              name="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />

            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
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

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !isPasswordFormValid}
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile
