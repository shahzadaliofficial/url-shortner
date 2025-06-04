import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createShortUrl, createCustomShortUrl } from '../api/shortUrl.api'
import { useAuth } from '../contexts/AuthContext'

const UrlShortnerForm = () => {
  const [fullUrl, setFullUrl] = useState('')
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
    <div className='max-w-md mx-auto mt-10 p-6 border-2 rounded-lg shadow-lg bg-white'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h1 className='text-2xl font-bold text-center mb-6'>URL Shortener</h1>
        
        <div className='space-y-2'>
          <label className='block text-sm font-medium'>Full URL</label>
          <input 
            type="url" 
            value={fullUrl}
            onChange={(e) => setFullUrl(e.target.value)}
            placeholder='https://www.example.com/very/long/url' 
            className='w-full border-2 rounded p-2 focus:outline-none focus:border-blue-500' 
            required
          />
        </div>
        
        <div className='space-y-2'>
          <label className='block text-sm font-medium'>
            Custom Short ID {!isAuthenticated && '(Login Required)'}
          </label>
          <div className='flex items-center rounded focus-within:border-blue-500'>
            <span className='bg-gray-100 px-3 py-2 text-gray-600 rounded-l border border-r-0'>
              {domain}
            </span>
            <input 
              type="text" 
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder={isAuthenticated ? 'my-custom-url' : 'Login to use custom URLs'} 
              className='flex-1 p-2 border rounded-r focus:outline-none' 
              pattern="[a-zA-Z0-9-_]+" 
              title="Only letters, numbers, hyphens, and underscores are allowed"
              disabled={!isAuthenticated}
            />
          </div>
          <span className='text-xs text-gray-500'>
            {isAuthenticated 
              ? 'Only letters, numbers, hyphens, and underscores are allowed'
              : 'Please login to create custom URLs'
            }
          </span>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400'
        >
          {loading ? 'Converting...' : 'Convert to Short URL'}
        </button>

        {error && (
          <p className='text-red-500 text-sm'>{error}</p>
        )}

        {shortUrl && (
          <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded'>
            <h3 className='text-green-800 font-medium mb-2'>✅ Success! Your short URL is ready:</h3>
            <div className='flex items-center justify-between bg-white border rounded px-3 py-2'>
              <span className='text-sm text-gray-900 truncate flex-1'>{shortUrl}</span>
              <button
                type="button"
                onClick={handleCopy}
                className={`ml-2 px-3 py-1 rounded transition-all duration-300 ${
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

        {!isAuthenticated && (
          <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded'>
            <p className='text-blue-800 text-sm text-center mb-3'>
              <span className='font-medium'>Want more features?</span> Login to create custom URLs and track statistics!
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors'
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