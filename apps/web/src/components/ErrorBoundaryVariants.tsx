import React from 'react'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  children: React.ReactNode
}

// Specialized Error Boundary for generation components
export const GenerationErrorBoundary: React.FC<Props> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Generation component error:', error, errorInfo)
    // Could send to error reporting service here
  }

  const fallback = (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Generation Component Error
          </h3>
        </div>
      </div>
      <p className="text-sm text-yellow-700 mb-4">
        There was an issue displaying the generated app content. You can try generating a new app or refresh the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm font-medium transition-colors"
      >
        Refresh Page
      </button>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}

// Specialized Error Boundary for entity forms
export const EntityFormErrorBoundary: React.FC<Props> = ({ children }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Entity form error:', error, errorInfo)
  }

  const fallback = (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="text-center">
        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-gray-600">
          Unable to display this form component
        </p>
      </div>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}