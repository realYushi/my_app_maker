import { useAppContext } from '../../contexts/AppContext'
import Navigation from './Navigation'
import EntityForm from './EntityForm'
import type { GenerationResult } from '@mini-ai-app-builder/shared-types'

interface GeneratedAppProps {
  generationResult: GenerationResult
}

const GeneratedApp = ({ generationResult }: GeneratedAppProps) => {
  const { reset } = useAppContext()

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
      {/* App Header */}
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{generationResult.appName}</h1>
          <button
            onClick={reset}
            className="px-4 py-2 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 whitespace-nowrap"
          >
            Generate New App
          </button>
        </div>
      </div>

      {/* Navigation */}
      <Navigation userRoles={generationResult.userRoles} features={generationResult.features} />

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">App Overview</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm sm:text-base text-gray-700">
              This is a mock UI for <strong>{generationResult.appName}</strong> with{' '}
              <span className="inline-block">{generationResult.entities.length} entities,</span>{' '}
              <span className="inline-block">{generationResult.userRoles.length} user roles,</span>{' '}
              <span className="inline-block">and {generationResult.features.length} features.</span>
            </p>
          </div>
        </div>

        {/* Entity Forms Section */}
        {generationResult.entities.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              {generationResult.entities.map((entity, index) => (
                <EntityForm key={index} entity={entity} />
              ))}
            </div>
          </div>
        )}

        {/* Features Overview */}
        {generationResult.features.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Features</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {generationResult.features.map((feature, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <button className="w-full sm:w-auto px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeneratedApp