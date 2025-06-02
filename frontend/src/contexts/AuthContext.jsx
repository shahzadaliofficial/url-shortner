import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/auth.api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const response = await getCurrentUser()
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.log('Not authenticated:', error.message)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
