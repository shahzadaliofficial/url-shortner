import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium inline-block"
          >
            Go Back Home
          </Link>
        </div>
      </main>
    </div>
  )
}

export default NotFound
