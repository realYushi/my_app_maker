import { useMemo, memo, useCallback } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import Navigation from './Navigation'
import { contextDetectionService, DomainContext } from '../../services/contextDetectionService'
import { componentFactory } from '../../services/componentFactory.tsx'
import { EntityFormErrorBoundary } from '../../components'
import type { GenerationResult } from '@mini-ai-app-builder/shared-types'

interface GeneratedAppProps {
  generationResult: GenerationResult
}

const GeneratedApp = memo(({ generationResult }: GeneratedAppProps) => {
  const { reset } = useAppContext()

  // Detect context for the entities once when component mounts or data changes
  const contextResult = useMemo(() => {
    return contextDetectionService.detectContext(generationResult.entities)
  }, [generationResult.entities])

  // Memoize context-aware header information
  const contextInfo = useMemo(() => {
    const primaryContext = contextResult.primaryContext

    switch (primaryContext) {
      case DomainContext.ECOMMERCE:
        return {
          theme: 'from-blue-600 to-blue-700',
          description: 'E-commerce platform',
          icon: '🛍️'
        }
      case DomainContext.USER_MANAGEMENT:
        return {
          theme: 'from-indigo-600 to-indigo-700',
          description: 'User management system',
          icon: '👥'
        }
      case DomainContext.ADMIN:
        return {
          theme: 'from-red-600 to-red-700',
          description: 'Administrative dashboard',
          icon: '⚙️'
        }
      default:
        return {
          theme: 'from-gray-600 to-gray-700',
          description: 'Application platform',
          icon: '📱'
        }
    }
  }, [contextResult.primaryContext])

  // Memoize entity components to prevent unnecessary re-renders
  const entityComponents = useMemo(() => {
    return generationResult.entities.map((entity, index) => {
      const EntityComponent = componentFactory.getComponent(entity, contextResult)
      return (
        <EntityFormErrorBoundary key={`${entity.name}-${index}`}>
          <EntityComponent entity={entity} />
        </EntityFormErrorBoundary>
      )
    })
  }, [generationResult.entities, contextResult])

  const handleReset = useCallback(() => {
    reset()
  }, [reset])

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
      {/* App Header */}
      <div className={`px-4 sm:px-6 py-4 bg-gradient-to-r ${contextInfo.theme} text-white`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{contextInfo.icon}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold truncate">{generationResult.appName}</h1>
              <p className="text-sm text-white/80">{contextInfo.description}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
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
            {contextResult.primaryContext !== DomainContext.GENERIC && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Detected Context:</span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {contextResult.primaryContext.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-gray-500">
                  ({contextResult.contextScores.find(cs => cs.domain === contextResult.primaryContext)?.matchedEntities.length || 0} matched entities)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Entity Forms Section */}
        {generationResult.entities.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              {entityComponents}
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
})

GeneratedApp.displayName = 'GeneratedApp'

export default GeneratedApp