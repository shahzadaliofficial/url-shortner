import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UrlShortnerForm from '../components/UrlShortnerForm'

const HomePage = () => {
  // Use the same API URL for frontend links since they point to the same deployment
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
  
  // Ensure URL doesn't end with slash for display purposes
  const displayUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Header />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shorten Your URLs
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create short, memorable links from long URLs. Track clicks and manage your links with our powerful dashboard.
            </p>
          </div>
          <UrlShortnerForm />
          
          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
              Why Choose Our URL Shortener?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Fast & Reliable</h3>
                <p className="text-gray-600 dark:text-gray-400">Lightning-fast URL shortening with 99.9% uptime guarantee.</p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Analytics & Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400">Track clicks, monitor performance, and get detailed insights.</p>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Custom URLs</h3>
                <p className="text-gray-600 dark:text-gray-400">Create branded short links with your own custom aliases.</p>
              </div>
            </div>
          </div>

          {/* Click Tracking Demo */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 transition-colors duration-200">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                🎯 Live Click Tracking Demo
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Click the links below to see real-time click tracking in action!
                <br />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  After clicking, refresh your dashboard to see updated click counts
                </span>
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Test Link #1</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Redirects to Google</p>
                  <a 
                    href={`${displayUrl}/FoUzbFD`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {displayUrl}/FoUzbFD
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Test Link #2</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Redirects to ChatGPT</p>
                  <a 
                    href={`${displayUrl}/VXkRNKE`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {displayUrl}/VXkRNKE
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  💡 <strong>Pro Tip:</strong> Login to see these clicks counted in your personal dashboard with real-time updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage