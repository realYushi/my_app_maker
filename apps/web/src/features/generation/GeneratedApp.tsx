import { useMemo, memo, useCallback, useState } from 'react'
import { Tab, Disclosure } from '@headlessui/react'
import { ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
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
  const [showOverview, setShowOverview] = useState(true)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview')

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
      {/* Collapsible App Header */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <div className={`px-4 sm:px-6 py-4 bg-gradient-to-r ${contextInfo.theme} text-white`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{contextInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold truncate">{generationResult.appName}</h1>
                    <p className="text-sm text-white/80">{contextInfo.description}</p>
                  </div>
                  <Disclosure.Button className="ml-2 p-2 rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <span className="sr-only">{open ? 'Hide' : 'Show'} app details</span>
                    <InformationCircleIcon className="h-5 w-5" />
                    <ChevronDownIcon
                      className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </Disclosure.Button>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 whitespace-nowrap min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  Generate New App
                </button>
              </div>
            </div>

            <Disclosure.Panel className="px-4 sm:px-6 py-4 bg-white border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* App Statistics */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">App Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Entities</span>
                      <span className="text-sm font-medium text-gray-900">{generationResult.entities.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">User Roles</span>
                      <span className="text-sm font-medium text-gray-900">{generationResult.userRoles.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Features</span>
                      <span className="text-sm font-medium text-gray-900">{generationResult.features.length}</span>
                    </div>
                  </div>
                </div>

                {/* Context Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Context Detection</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Primary Domain</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {contextResult.primaryContext.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Matched Entities</span>
                      <div className="mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          {contextResult.contextScores.find(cs => cs.domain === contextResult.primaryContext)?.matchedEntities.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Description */}
                {generationResult.description && (
                  <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {generationResult.description}
                    </p>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Navigation */}
      <Navigation
        userRoles={generationResult.userRoles}
        features={generationResult.features}
        onOverviewToggle={() => setShowOverview(!showOverview)}
        showOverview={showOverview}
      />

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        {/* View Mode Toggle Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose between overview and detailed view modes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  viewMode === 'overview'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  viewMode === 'detailed'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'overview' ? (
          /* Overview Mode - High-level summary */
          <div className="space-y-6">
            {/* Application Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{contextInfo.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{generationResult.appName}</h3>
                  <p className="text-sm text-gray-600">{contextInfo.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{generationResult.entities.length}</div>
                  <div className="text-sm text-gray-600">Data Entities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{generationResult.userRoles.length}</div>
                  <div className="text-sm text-gray-600">User Roles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">{generationResult.features.length}</div>
                  <div className="text-sm text-gray-600">Features</div>
                </div>
              </div>

              {contextResult.primaryContext !== DomainContext.GENERIC && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Detected Domain:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                      {contextResult.primaryContext.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Entities Quick View */}
              {generationResult.entities.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-base font-medium text-gray-900 mb-3">Data Entities</h4>
                  <div className="space-y-2">
                    {generationResult.entities.slice(0, 3).map((entity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{entity.name}</span>
                        <span className="text-xs text-gray-500">{entity.attributes.length} fields</span>
                      </div>
                    ))}
                    {generationResult.entities.length > 3 && (
                      <div className="text-xs text-gray-500 pt-1">
                        +{generationResult.entities.length - 3} more entities
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features Quick View */}
              {generationResult.features.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-base font-medium text-gray-900 mb-3">Key Features</h4>
                  <div className="space-y-2">
                    {generationResult.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-gray-700 font-medium">{feature.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{feature.description}</div>
                      </div>
                    ))}
                    {generationResult.features.length > 3 && (
                      <div className="text-xs text-gray-500 pt-1">
                        +{generationResult.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Roles Quick View */}
              {generationResult.userRoles.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-base font-medium text-gray-900 mb-3">User Roles</h4>
                  <div className="space-y-2">
                    {generationResult.userRoles.slice(0, 3).map((role, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-gray-700 font-medium">{role.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{role.description}</div>
                      </div>
                    ))}
                    {generationResult.userRoles.length > 3 && (
                      <div className="text-xs text-gray-500 pt-1">
                        +{generationResult.userRoles.length - 3} more roles
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                Switch to detailed view to explore entities, manage data, and access all features
              </p>
              <button
                onClick={() => setViewMode('detailed')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Switch to Detailed View
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Mode - Full content display */
          <div className="space-y-8">
            {/* Entity Forms Section */}
            {generationResult.entities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Data Management</h3>
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

        {/* Features Overview with Progressive Disclosure */}
        {generationResult.features.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Available Features</h2>

            {/* Features with progressive disclosure */}
            <div className="space-y-4">
              {generationResult.features.map((feature, index) => (
                <Disclosure key={index} as="div" defaultOpen={false}>
                  {({ open }) => (
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                      {/* Feature Header */}
                      <Disclosure.Button className="w-full px-4 sm:px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {feature.name}
                              </h3>
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 flex-shrink-0">
                                Feature
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {feature.description}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                            <span className="text-xs text-gray-500 hidden sm:block">
                              {open ? 'Less details' : 'More details'}
                            </span>
                            <ChevronDownIcon
                              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                                open ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </Disclosure.Button>

                      {/* Feature Details Panel */}
                      <Disclosure.Panel className="px-4 sm:px-6 py-4 border-t border-gray-200">
                        <div className="space-y-6">
                          {/* Feature Description */}
                          <div>
                            <h4 className="text-base font-medium text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>

                          {/* CRUD Operations Section */}
                          {feature.operations && feature.operations.length > 0 && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-3">Available Operations</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {feature.operations.map((operation, opIndex) => (
                                  <div
                                    key={opIndex}
                                    className="p-3 bg-gray-50 rounded-md border border-gray-200"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                        operation.toLowerCase() === 'create' ? 'bg-green-100 text-green-700' :
                                        operation.toLowerCase() === 'read' ? 'bg-blue-100 text-blue-700' :
                                        operation.toLowerCase() === 'update' ? 'bg-yellow-100 text-yellow-700' :
                                        operation.toLowerCase() === 'delete' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {operation.toUpperCase()}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      {operation.toLowerCase() === 'create' ? 'Add new records' :
                                       operation.toLowerCase() === 'read' ? 'View and search' :
                                       operation.toLowerCase() === 'update' ? 'Modify existing' :
                                       operation.toLowerCase() === 'delete' ? 'Remove records' :
                                       `${operation} operation`}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Role Permissions Section */}
                          {feature.rolePermissions && Object.keys(feature.rolePermissions).length > 0 && (
                            <Disclosure as="div" defaultOpen={false}>
                              {({ open: permissionsOpen }) => (
                                <>
                                  <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span>Role Permissions ({feature.rolePermissions ? Object.keys(feature.rolePermissions).length : 0} roles)</span>
                                    <ChevronDownIcon
                                      className={`h-4 w-4 transition-transform duration-200 ${
                                        permissionsOpen ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="mt-3 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {feature.rolePermissions && Object.entries(feature.rolePermissions).map(([role, permissions], permIndex) => (
                                        <div
                                          key={permIndex}
                                          className="p-3 bg-gray-50 rounded-md border border-gray-200"
                                        >
                                          <h5 className="text-sm font-medium text-gray-900 mb-2 capitalize">
                                            {role.replace('_', ' ')}
                                          </h5>
                                          <div className="flex flex-wrap gap-1">
                                            {Array.isArray(permissions) ? permissions.map((permission, permSubIndex) => (
                                              <span
                                                key={permSubIndex}
                                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700"
                                              >
                                                {permission}
                                              </span>
                                            )) : (
                                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                                {permissions}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          )}

                          {/* Related Entities Section */}
                          {feature.relatedEntities && feature.relatedEntities.length > 0 && (
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-3">Related Entities</h4>
                              <div className="flex flex-wrap gap-2">
                                {feature.relatedEntities.map((entityName, entityIndex) => (
                                  <span
                                    key={entityIndex}
                                    className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700"
                                  >
                                    {entityName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mock Implementation Note */}
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 italic">
                              This feature is part of the AI-generated app structure for preview purposes.
                            </p>
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>

            {/* Features Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{generationResult.features.length} features</span> available
                in this application. Click on any feature above to view detailed CRUD operations, role permissions, and related entities.
              </p>
            </div>
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