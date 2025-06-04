import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getUserUrls, logoutUser } from '../api/auth.api'
import { createShortUrl, createCustomShortUrl } from '../api/shortUrl.api'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import ThemeToggle from '../components/ThemeToggle'
import Profile from '../components/Profile'

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
  // Ensure URL doesn't end with slash for display purposes
  const displayUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // Tab navigation state
  const [activeTab, setActiveTab] = useState('urls')
  
  // URL creation form states
  const [fullUrl, setFullUrl] = useState('https://')
  const [customId, setCustomId] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedUrls, setCopiedUrls] = useState(new Set())

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Only fetch URLs on initial load
    fetchUserUrls()
  }, [isAuthenticated, navigate])

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
      setFullUrl('https://')
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

  const handleCopyUrl = async (shortUrlId) => {
    try {
      const urlToCopy = `${displayUrl}/${shortUrlId}`
      await navigator.clipboard.writeText(urlToCopy)
      
      // Add to copied set
      setCopiedUrls(prev => new Set(prev).add(shortUrlId))
      
      // Remove from copied set after 2 seconds
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev)
          newSet.delete(shortUrlId)
          return newSet
        })
      }, 2000)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">URL Shortener Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('urls')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'urls'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                My URLs ({urls.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Profile Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'urls' ? (
            <>
              {/* URL Creation Form */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-8 transition-colors duration-200">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                Create Short URL
              </h2>
              
              <form onSubmit={handleCreateUrl} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full URL
                  </label>
                  <input
                    type="url"
                    value={fullUrl}
                    onChange={(e) => setFullUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url"
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border transition-colors duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Short ID (Optional)
                  </label>
                  <div className="mt-1">
                    <div className="flex flex-col sm:flex-row rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 py-2 sm:py-0 sm:rounded-l-md rounded-t-md sm:rounded-t-none border border-b-0 sm:border-b sm:border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-sm truncate">
                        <span className="hidden sm:inline">{displayUrl}/</span>
                        <span className="sm:hidden">URL will be: {displayUrl}/</span>
                      </span>
                      <input
                        type="text"
                        value={customId}
                        onChange={(e) => setCustomId(e.target.value)}
                        placeholder="my-custom-url"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-b-md sm:rounded-b-none sm:rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm border transition-colors duration-200"
                        pattern="[a-zA-Z0-9-_]+"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Only letters, numbers, hyphens, and underscores allowed
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200"
                >
                  {creating ? 'Creating...' : 'Create Short URL'}
                </button>
              </form>

              {error && (
                <div className={`mt-4 p-3 rounded-md text-sm transition-colors duration-200 ${
                  error.includes('successfully') 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                }`}>
                  {error}
                </div>
              )}

              {shortUrl && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md transition-colors duration-200">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">URL Created Successfully!</h3>
                  <div className="flex items-center justify-between bg-white dark:bg-gray-700 border dark:border-gray-600 rounded px-3 py-2 transition-colors duration-200">
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate flex-1">{shortUrl}</span>
                    <button
                      onClick={handleCopy}
                      className={`ml-2 px-3 py-1 rounded text-sm transition-all duration-300 ${
                        copied 
                          ? 'bg-green-600 dark:bg-green-700 text-white' 
                          : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
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
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md transition-colors duration-200">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Your URLs ({urls.length})
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Manage and track your shortened URLs
                  {lastUpdated && (
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      • Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => fetchUserUrls(true)}
                disabled={loading || refreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className={`-ml-0.5 mr-2 h-4 w-4 ${(loading || refreshing) ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {refreshing ? 'Refreshing...' : loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            {urls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No URLs created yet. Create your first short URL above!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {urls.map((url, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate">
                              {displayUrl}/{url.short_url}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {url.full_url}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{url.clicks || 0}</span>
                            <span className="ml-1">clicks</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total visits
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyUrl(url.short_url)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                            copiedUrls.has(url.short_url)
                              ? 'bg-green-600 dark:bg-green-700 text-white' 
                              : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                          }`}
                        >
                          {copiedUrls.has(url.short_url) ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
            </>
          ) : (
            /* Profile Tab Content */
            <Profile />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
