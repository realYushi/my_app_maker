import React, { Component, type ReactNode } from 'react';
import { errorHandlingService, createComponentError } from '@mini-ai-app-builder/shared-types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  componentName?: string;
  action?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = createComponentError(
      error,
      this.props.componentName || 'UnknownComponent',
      this.props.action || 'render',
    );

    // Log to centralized error service
    errorHandlingService.handleError(appError);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error ID for tracking
    this.setState({ errorId: appError.id });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="m-4 rounded-lg border border-red-200 bg-red-50 p-6"
          role="alert"
          aria-live="polite"
        >
          <div className="mb-4 flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Component Error</h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-red-700">
              {this.props.componentName
                ? `The ${this.props.componentName} component encountered an error.`
                : 'A component encountered an error.'}
              This might be a temporary issue.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-2">
                <summary className="cursor-pointer rounded text-xs text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                  Error details (development only)
                </summary>
                <pre className="mt-1 max-h-32 overflow-auto rounded bg-red-100 p-2 text-xs text-red-600">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={this.handleRetry}
              className="rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Retry the component"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Reload the page"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
