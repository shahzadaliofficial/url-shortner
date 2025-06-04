import React, { useState } from 'react'

const FormInput = ({ 
  label, 
  type, 
  value, 
  onChange, 
  validation, 
  placeholder, 
  required = false,
  autoComplete,
  showStrength = false,
  disabled = false
}) => {
  const [isTouched, setIsTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleBlur = () => {
    setIsTouched(true)
  }

  const handleChange = (e) => {
    onChange(e.target.value)
    if (!isTouched) setIsTouched(true)
  }

  const hasErrors = validation && validation.errors && validation.errors.length > 0
  const showErrors = isTouched && hasErrors

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'weak': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  const getStrengthText = (strength) => {
    switch (strength) {
      case 'strong': return 'Strong password'
      case 'medium': return 'Medium strength'
      case 'weak': return 'Weak password'
      default: return ''
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 ${
            showErrors 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
          } ${disabled ? 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed' : ''}`}
        />
        
        {/* Password visibility toggle */}
        {type === 'password' && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Password strength indicator */}
      {showStrength && type === 'password' && value && validation && (
        <div className="space-y-1">
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  validation.score >= level ? getStrengthColor(validation.strength) : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs ${
            validation.strength === 'strong' ? 'text-green-600 dark:text-green-400' :
            validation.strength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {getStrengthText(validation.strength)}
          </p>
        </div>
      )}

      {/* Error messages */}
      {showErrors && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-red-600 dark:text-red-400 text-xs">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Success indicator */}
      {isTouched && validation && validation.isValid && value && (
        <div className="flex items-center space-x-1">
          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-600 dark:text-green-400 text-xs">Valid</p>
        </div>
      )}
    </div>
  )
}

export default FormInput
