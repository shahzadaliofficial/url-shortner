import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            © 2025 URL Shortener. Built with React, Node.js, and MongoDB.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Shorten your links, track your clicks, manage your URLs.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
