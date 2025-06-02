import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserUrls, logoutUser } from '../api/auth.api'
import { createShortUrl, createCustomShortUrl } from '../api/shortUrl.api'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // URL creation form states
  const [fullUrl, setFullUrl] = useState('')
  const [customId, setCustomId] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchUserUrls()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchUserUrls(true), 30000)
    
    return () => clearInterval(interval)
  }, [isAuthenticated, navigate])

  // Add effect to refresh data when component mounts or when user navigates back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        fetchUserUrls(true)
      }
    }

    const handleFocus = () => {
      if (isAuthenticated) {
        fetchUserUrls(true)
      }
    }

    const handleKeyPress = (e) => {
      // Refresh on F5 or Ctrl+R
      if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && isAuthenticated) {
        e.preventDefault()
        fetchUserUrls(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isAuthenticated])

  const fetchUserUrls = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
        setError('') // Clear any previous errors
      } else {
        setLoading(true)
      }
      
      console.log('Fetching user URLs...')
      const response = await getUserUrls()
      setUrls(response.data.urls || [])
      setLastUpdated(new Date())
      console.log('URLs fetched successfully:', response.data.urls?.length || 0)
      
      if (isRefresh) {
        // Show brief success message for manual refresh
        setTimeout(() => {
          setError('Data refreshed successfully!')
          setTimeout(() => setError(''), 2000)
        }, 100)
      }
    } catch (error) {
      setError('Failed to fetch URLs')
      console.error('Error fetching URLs:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCreateUrl = async (e) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    setShortUrl('')

    try {
      let response
      if (customId.trim()) {
        response = await createCustomShortUrl(fullUrl, customId)
      } else {
        response = await createShortUrl(fullUrl)
      }
      
      setShortUrl(response.data.url)
      setFullUrl('')
      setCustomId('')
      
      // Refresh the URLs list
      await fetchUserUrls(true)
      
    } catch (error) {
      setError(error.message || 'Failed to create short URL')
    } finally {
      setCreating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('Failed to copy URL')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      logout()
      navigate('/')
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">URL Shortener Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* URL Creation Form */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Create Short URL
              </h2>
              
              <form onSubmit={handleCreateUrl} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full URL
                  </label>
                  <input
                    type="url"
                    value={fullUrl}
                    onChange={(e) => setFullUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Short ID (Optional)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      http://localhost:3000/
                    </span>
                    <input
                      type="text"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                      placeholder="my-custom-url"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                      pattern="[a-zA-Z0-9-_]+"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Only letters, numbers, hyphens, and underscores allowed
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
                >
                  {creating ? 'Creating...' : 'Create Short URL'}
                </button>
              </form>

              {error && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  error.includes('successfully') 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              {shortUrl && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="text-sm font-medium text-green-800 mb-2">URL Created Successfully!</h3>
                  <div className="flex items-center justify-between bg-white border rounded px-3 py-2">
                    <span className="text-sm text-gray-900 truncate flex-1">{shortUrl}</span>
                    <button
                      onClick={handleCopy}
                      className={`ml-2 px-3 py-1 rounded text-sm transition-all duration-300 ${
                        copied 
                          ? 'bg-green-600 text-white' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* URLs List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Your URLs ({urls.length})
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage and track your shortened URLs
                  {lastUpdated && (
                    <span className="ml-2 text-xs text-gray-400">
                      • Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => fetchUserUrls(true)}
                disabled={loading || refreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <svg className={`-ml-0.5 mr-2 h-4 w-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Refreshing...' : loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            {urls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No URLs created yet. Create your first short URL above!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {urls.map((url, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              http://localhost:3000/{url.short_url}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {url.full_url}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            <span className="text-lg font-bold text-blue-600">{url.clicks || 0}</span>
                            <span className="ml-1">clicks</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Total visits
                          </p>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(`http://localhost:3000/${url.short_url}`)}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
