import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 URL Shortener. Built with React, Node.js, and MongoDB.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
            Shorten your links, track your clicks, manage your URLs.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
