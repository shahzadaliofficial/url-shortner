import axiosInstance from '../utils/axiosInstance'

// Register user
export const registerUser = (name, email, password) => {
  return axiosInstance.post('/api/auth/register', {
    name,
    email,
    password
  })
}

// Login user
export const loginUser = (email, password) => {
  return axiosInstance.post('/api/auth/login', {
    email,
    password
  })
}

// Logout user
export const logoutUser = () => {
  return axiosInstance.post('/api/auth/logout')
}

// Get current user
export const getCurrentUser = () => {
  return axiosInstance.get('/api/auth/me')
}

// Verify email
export const verifyEmail = (token) => {
  return axiosInstance.post('/api/auth/verify-email', {
    token
  })
}

// Resend verification email
export const resendVerification = (email) => {
  return axiosInstance.post('/api/auth/resend-verification', {
    email
  })
}

// Resend verification email (alias for consistency)
export const resendVerificationEmail = (email) => {
  return axiosInstance.post('/api/auth/resend-verification', {
    email
  })
}

// Get user's URLs
export const getUserUrls = () => {
  return axiosInstance.get('/api/user/urls')
}

// Update user profile
export const updateProfile = (profileData) => {
  return axiosInstance.put('/api/auth/profile', profileData)
}

// Change password
export const changePassword = (passwordData) => {
  return axiosInstance.put('/api/auth/change-password', passwordData)
}

// Forgot password - send reset email
export const forgotPassword = (email) => {
  return axiosInstance.post('/api/auth/forgot-password', {
    email
  })
}

// Reset password with token
export const resetPassword = (token, newPassword) => {
  return axiosInstance.post('/api/auth/reset-password', {
    token,
    newPassword
  })
}
