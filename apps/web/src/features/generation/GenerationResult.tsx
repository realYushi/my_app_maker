import { useAppContext } from '../../contexts/AppContext'

const GenerationResult = () => {
  const { status, generationResult, error, reset } = useAppContext()

  if (status === 'idle' || status === 'loading') {
    return null
  }

  if (status === 'error') {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Generation Failed</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={reset}
              className="mt-3 text-sm text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success' && generationResult) {
    return (
      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Generated App Structure</h2>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate New App
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{generationResult.appName}</h3>
          </div>

          <div className="p-6 space-y-6">
            {generationResult.entities.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Entities</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {generationResult.entities.map((entity, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">{entity.name}</h5>
                      <div className="space-y-1">
                        {entity.attributes.map((attr, attrIndex) => (
                          <span key={attrIndex} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded mr-2 mb-1">
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generationResult.userRoles.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">User Roles</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {generationResult.userRoles.map((role, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">{role.name}</h5>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generationResult.features.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Features</h4>
                <div className="space-y-3">
                  {generationResult.features.map((feature, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">{feature.name}</h5>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default GenerationResult