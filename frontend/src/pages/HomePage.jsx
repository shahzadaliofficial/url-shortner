import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UrlShortnerForm from '../components/UrlShortnerForm'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shorten Your URLs
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create short, memorable links from long URLs. Track clicks and manage your links with our powerful dashboard.
            </p>
          </div>
          <UrlShortnerForm />
          
          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
              Why Choose Our URL Shortener?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2">Fast & Reliable</h3>
                <p className="text-gray-600">Lightning-fast URL shortening with 99.9% uptime guarantee.</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Analytics & Tracking</h3>
                <p className="text-gray-600">Track clicks, monitor performance, and get detailed insights.</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold mb-2">Custom URLs</h3>
                <p className="text-gray-600">Create branded short links with your own custom aliases.</p>
              </div>
            </div>
          </div>

          {/* Click Tracking Demo */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                🎯 Live Click Tracking Demo
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Click the links below to see real-time click tracking in action!
                <br />
                <span className="text-sm text-blue-600">
                  After clicking, refresh your dashboard to see updated click counts
                </span>
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Test Link #1</h3>
                  <p className="text-sm text-gray-600 mb-3">Redirects to Google</p>
                  <a 
                    href="http://localhost:3000/OvyNjpg" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    http://localhost:3000/OvyNjpg
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">Test Link #2</h3>
                  <p className="text-sm text-gray-600 mb-3">Redirects to ChatGPT</p>
                  <a 
                    href="http://localhost:3000/kyRsVp0" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    http://localhost:3000/kyRsVp0
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
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