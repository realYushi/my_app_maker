import { useMemo, memo, useCallback } from 'react'
import { Tab } from '@headlessui/react'
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
            className="px-4 py-2 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 whitespace-nowrap min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            <Tab.Group>
              <Tab.List
                className="flex flex-wrap gap-1 sm:gap-2 p-1 sm:p-2 bg-gray-100 rounded-lg overflow-x-auto"
                aria-label="Entity management tabs"
              >
                {generationResult.entities.map((entity, index) => (
                  <Tab
                    key={`tab-${entity.name}-${index}`}
                    className={({ selected }) =>
                      `px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] flex items-center min-w-[44px] justify-center ${
                        selected
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`
                    }
                    aria-label={`${entity.name} entity management`}
                  >
                    {entity.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-4">
                {entityComponents.map((entityComponent, index) => (
                  <Tab.Panel
                    key={`panel-${generationResult.entities[index].name}-${index}`}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                  >
                    {entityComponent}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        )}

        {/* Features Overview with Responsive Grid */}
        {generationResult.features.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Features</h2>

            {/* Mobile-first responsive grid layout */}
            <div className={`grid gap-4 sm:gap-6 md:gap-6 lg:gap-8 ${
              generationResult.features.length === 1
                ? 'grid-cols-1'
                : generationResult.features.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : generationResult.features.length <= 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {generationResult.features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 sm:p-5 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2 text-base sm:text-lg leading-tight">
                        {feature.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Feature type indicator */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        Feature
                      </span>
                    </div>

                    {/* Touch-friendly button */}
                    <button className="w-full px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[44px] group-hover:bg-blue-150">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid layout helper for many features */}
            {generationResult.features.length > 6 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Showing all {generationResult.features.length} features in responsive grid layout
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

GeneratedApp.displayName = 'GeneratedApp'

export default GeneratedApp