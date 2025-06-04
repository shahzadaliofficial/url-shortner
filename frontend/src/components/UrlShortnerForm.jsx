import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShortUrl, createCustomShortUrl } from '../api/shortUrl.api'
import { useAuth } from '../contexts/AuthContext'

const UrlShortnerForm = () => {
  const [fullUrl, setFullUrl] = useState('https://')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [customId, setCustomId] = useState('')
  
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
  const domain = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // If user enters custom ID but is not authenticated, redirect to login
    if (customId.trim() && !isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      let response
      if (customId.trim()) {
        response = await createCustomShortUrl(fullUrl, customId)
      } else {
        response = await createShortUrl(fullUrl)
      }
      setShortUrl(response.data.url)
    } catch (error) {
      if (error.status === 401) {
        setError('Please login to use custom URLs')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(error.message || 'Failed to create short URL')
      }
    } finally {
      setLoading(false)
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

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border-2 rounded-lg shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-200'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h1 className='text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white'>URL Shortener</h1>
        
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Full URL</label>
          <input 
            type="url" 
            value={fullUrl}
            onChange={(e) => setFullUrl(e.target.value)}
            placeholder='https://www.example.com/very/long/url' 
            className='w-full border-2 border-gray-300 dark:border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200' 
            required
          />
        </div>
        
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Custom Short ID {!isAuthenticated && '(Login Required)'}
          </label>
          <div className='flex items-center rounded focus-within:border-blue-500'>
            <span className='bg-gray-100 dark:bg-gray-600 px-3 py-2 text-gray-600 dark:text-gray-300 rounded-l border border-r-0 border-gray-300 dark:border-gray-600'>
              {domain}
            </span>
            <input 
              type="text" 
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder={isAuthenticated ? 'my-custom-url' : 'Login to use custom URLs'} 
              className='flex-1 w-0 p-2 border border-gray-300 dark:border-gray-600 rounded-r focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200' 
              pattern="[a-zA-Z0-9-_]+" 
              title="Only letters, numbers, hyphens, and underscores are allowed"
              disabled={!isAuthenticated}
            />
          </div>
          <span className='text-xs text-gray-500 dark:text-gray-400'>
            {isAuthenticated 
              ? 'Only letters, numbers, hyphens, and underscores are allowed'
              : 'Please login to create custom URLs'
            }
          </span>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className='w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors duration-200'
        >
          {loading ? 'Converting...' : 'Convert to Short URL'}
        </button>

        {error && (
          <p className='text-red-600 dark:text-red-400 text-sm'>{error}</p>
        )}

        {shortUrl && (
          <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded transition-colors duration-200'>
            <h3 className='text-green-800 dark:text-green-400 font-medium mb-2'>✅ Success! Your short URL is ready:</h3>
            <div className='flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 transition-colors duration-200'>
              <span className='text-sm text-gray-900 dark:text-gray-100 truncate flex-1'>{shortUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className={`ml-2 px-3 py-1 rounded transition-all duration-300 ${
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

        {!isAuthenticated && (
          <div className='mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded transition-colors duration-200'>
            <p className='text-blue-800 dark:text-blue-200 text-sm text-center mb-3'>
              <span className='font-medium'>Want more features?</span> Login to create custom URLs and track statistics!
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className='w-full bg-green-500 dark:bg-green-600 text-white py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200'
            >
              Login Now
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default UrlShortnerForm