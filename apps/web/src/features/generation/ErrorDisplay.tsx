import { useAppContext } from '../../hooks/useAppContext';

const ErrorDisplay = () => {
  const { error, reset } = useAppContext();

  if (!error) return null;

  return (
    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
          <div className="mt-2">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={reset}
              className="rounded-md border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
