import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-3 rounded-md text-lg font-medium inline-block transition-colors duration-200"
          >
            Go Back Home
          </Link>
        </div>
      </main>
    </div>
  )
}

export default NotFound
