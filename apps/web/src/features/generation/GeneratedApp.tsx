import { useMemo, memo, useCallback, useState } from 'react';
import { Tab, Disclosure } from '@headlessui/react';
import { ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../../hooks/useAppContext';
import Navigation from './Navigation';
import { contextDetectionService, DomainContext } from '../../services/contextDetectionService';
import { componentFactory } from '../../services/componentFactory.tsx';
import { EntityFormErrorBoundary } from '../../components';
import type { GenerationResult } from '@mini-ai-app-builder/shared-types';

interface GeneratedAppProps {
  generationResult: GenerationResult;
}

const GeneratedApp = memo(({ generationResult }: GeneratedAppProps) => {
  const { reset } = useAppContext();
  const [showOverview, setShowOverview] = useState(true);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Detect context for the entities once when component mounts or data changes
  const contextResult = useMemo(() => {
    return contextDetectionService.detectContext(generationResult.entities);
  }, [generationResult.entities]);

  // Memoize context-aware header information
  const contextInfo = useMemo(() => {
    const primaryContext = contextResult.primaryContext;

    switch (primaryContext) {
      case DomainContext.ECOMMERCE:
        return {
          theme: 'from-blue-600 to-blue-700',
          description: 'E-commerce platform',
          icon: '🛍️',
        };
      case DomainContext.USER_MANAGEMENT:
        return {
          theme: 'from-indigo-600 to-indigo-700',
          description: 'User management system',
          icon: '👥',
        };
      case DomainContext.ADMIN:
        return {
          theme: 'from-red-600 to-red-700',
          description: 'Administrative dashboard',
          icon: '⚙️',
        };
      default:
        return {
          theme: 'from-gray-600 to-gray-700',
          description: 'Application platform',
          icon: '📱',
        };
    }
  }, [contextResult.primaryContext]);

  // Memoize entity components to prevent unnecessary re-renders
  const entityComponents = useMemo(() => {
    return generationResult.entities.map((entity, index) => {
      const EntityComponent = componentFactory.getComponent(entity, contextResult);
      return (
        <EntityFormErrorBoundary
          key={`${entity.name}-${index}-${selectedTabIndex === index ? 'active' : 'inactive'}`}
        >
          <EntityComponent
            entity={entity}
            tabKey={selectedTabIndex === index ? selectedTabIndex : -1}
          />
        </EntityFormErrorBoundary>
      );
    });
  }, [generationResult.entities, contextResult, selectedTabIndex]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Collapsible App Header */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <div className={`bg-gradient-to-r px-4 py-4 sm:px-6 ${contextInfo.theme} text-white`}>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-2xl">{contextInfo.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h1 className="truncate text-xl font-bold sm:text-2xl">
                      {generationResult.appName}
                    </h1>
                    <p className="text-sm text-white/80">{contextInfo.description}</p>
                  </div>
                  <Disclosure.Button className="ml-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-white bg-opacity-20 p-2 transition-all duration-200 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                    <span className="sr-only">{open ? 'Hide' : 'Show'} app details</span>
                    <InformationCircleIcon className="h-5 w-5" />
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </Disclosure.Button>
                </div>
                <button
                  onClick={handleReset}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center whitespace-nowrap rounded-md bg-white bg-opacity-20 px-4 py-2 text-sm font-medium transition-colors hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Generate New App
                </button>
              </div>
            </div>

            <Disclosure.Panel className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* App Statistics */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">App Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-600">Entities</span>
                      <span className="text-sm font-medium text-gray-900">
                        {generationResult.entities.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-600">User Roles</span>
                      <span className="text-sm font-medium text-gray-900">
                        {generationResult.userRoles.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-gray-600">Features</span>
                      <span className="text-sm font-medium text-gray-900">
                        {generationResult.features.length}
                      </span>
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
                        <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {contextResult.primaryContext
                            .replace('_', ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Matched Entities</span>
                      <div className="mt-1">
                        <span className="text-sm font-medium text-gray-900">
                          {contextResult.contextScores.find(
                            cs => cs.domain === contextResult.primaryContext,
                          )?.matchedEntities.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Description */}
                {generationResult.description && (
                  <div className="space-y-3 md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                    <p className="text-sm leading-relaxed text-gray-700">
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
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
            <p className="mt-1 text-sm text-gray-600">
              Choose between overview and detailed view modes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  viewMode === 'overview'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  viewMode === 'detailed'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
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
            <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{contextInfo.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {generationResult.appName}
                  </h3>
                  <p className="text-sm text-gray-600">{contextInfo.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {generationResult.entities.length}
                  </div>
                  <div className="text-sm text-gray-600">Data Entities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {generationResult.userRoles.length}
                  </div>
                  <div className="text-sm text-gray-600">User Roles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {generationResult.features.length}
                  </div>
                  <div className="text-sm text-gray-600">Features</div>
                </div>
              </div>

              {contextResult.primaryContext !== DomainContext.GENERIC && (
                <div className="mt-4 border-t border-blue-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Detected Domain:</span>
                    <span className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {contextResult.primaryContext
                        .replace('_', ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Entities Quick View */}
              {generationResult.entities.length > 0 && (
                <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                  <h4 className="mb-3 text-base font-medium text-gray-900">Data Entities</h4>
                  <div className="space-y-2">
                    {generationResult.entities.slice(0, 3).map((entity, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{entity.name}</span>
                        <span className="text-xs text-gray-500">
                          {entity.attributes.length} fields
                        </span>
                      </div>
                    ))}
                    {generationResult.entities.length > 3 && (
                      <div className="pt-1 text-xs text-gray-500">
                        +{generationResult.entities.length - 3} more entities
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Features Quick View */}
              {generationResult.features.length > 0 && (
                <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                  <h4 className="mb-3 text-base font-medium text-gray-900">Key Features</h4>
                  <div className="space-y-2">
                    {generationResult.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-700">{feature.name}</div>
                        <div className="line-clamp-1 text-xs text-gray-500">
                          {feature.description}
                        </div>
                      </div>
                    ))}
                    {generationResult.features.length > 3 && (
                      <div className="pt-1 text-xs text-gray-500">
                        +{generationResult.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* User Roles Quick View */}
              {generationResult.userRoles.length > 0 && (
                <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                  <h4 className="mb-3 text-base font-medium text-gray-900">User Roles</h4>
                  <div className="space-y-2">
                    {generationResult.userRoles.slice(0, 3).map((role, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-medium text-gray-700">{role.name}</div>
                        <div className="line-clamp-1 text-xs text-gray-500">{role.description}</div>
                      </div>
                    ))}
                    {generationResult.userRoles.length > 3 && (
                      <div className="pt-1 text-xs text-gray-500">
                        +{generationResult.userRoles.length - 3} more roles
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <p className="mb-3 text-sm text-gray-600">
                Switch to detailed view to explore entities, manage data, and access all features
              </p>
              <button
                onClick={() => setViewMode('detailed')}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                <h3 className="mb-6 text-xl font-bold text-gray-900">Data Management</h3>
                <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
                  <Tab.List
                    className="flex flex-wrap gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 sm:gap-2 sm:p-2"
                    aria-label="Entity management tabs"
                  >
                    {generationResult.entities.map((entity, index) => (
                      <Tab
                        key={`tab-${entity.name}-${index}`}
                        className={({ selected }) =>
                          `flex min-h-[44px] min-w-[44px] items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-4 ${
                            selected
                              ? 'bg-white text-blue-700 shadow-sm'
                              : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
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
                        className="rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                <h2 className="mb-6 text-xl font-bold text-gray-900">Available Features</h2>

                {/* Features with progressive disclosure */}
                <div className="space-y-4">
                  {generationResult.features.map((feature, index) => (
                    <Disclosure key={index} as="div" defaultOpen={false}>
                      {({ open }) => (
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:border-gray-300 hover:shadow-lg">
                          {/* Feature Header */}
                          <Disclosure.Button className="w-full bg-gray-50 px-4 py-4 text-left transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex items-center gap-3">
                                  <h3 className="truncate text-lg font-semibold text-gray-900">
                                    {feature.name}
                                  </h3>
                                  <span className="inline-flex flex-shrink-0 items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                                    Feature
                                  </span>
                                </div>
                                <p className="line-clamp-2 text-sm text-gray-600">
                                  {feature.description}
                                </p>
                              </div>
                              <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                                <span className="hidden text-xs text-gray-500 sm:block">
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
                          <Disclosure.Panel className="border-t border-gray-200 px-4 py-4 sm:px-6">
                            <div className="space-y-6">
                              {/* Feature Description */}
                              <div>
                                <h4 className="mb-2 text-base font-medium text-gray-900">
                                  Description
                                </h4>
                                <p className="text-sm leading-relaxed text-gray-700">
                                  {feature.description}
                                </p>
                              </div>

                              {/* CRUD Operations Section */}
                              {feature.operations && feature.operations.length > 0 && (
                                <div>
                                  <h4 className="mb-3 text-base font-medium text-gray-900">
                                    Available Operations
                                  </h4>
                                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {feature.operations.map((operation, opIndex) => (
                                      <div
                                        key={opIndex}
                                        className="rounded-md border border-gray-200 bg-gray-50 p-3"
                                      >
                                        <div className="mb-1 flex items-center gap-2">
                                          <span
                                            className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                                              operation.toLowerCase() === 'create'
                                                ? 'bg-green-100 text-green-700'
                                                : operation.toLowerCase() === 'read'
                                                  ? 'bg-blue-100 text-blue-700'
                                                  : operation.toLowerCase() === 'update'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : operation.toLowerCase() === 'delete'
                                                      ? 'bg-red-100 text-red-700'
                                                      : 'bg-gray-100 text-gray-700'
                                            }`}
                                          >
                                            {operation.toUpperCase()}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                          {operation.toLowerCase() === 'create'
                                            ? 'Add new records'
                                            : operation.toLowerCase() === 'read'
                                              ? 'View and search'
                                              : operation.toLowerCase() === 'update'
                                                ? 'Modify existing'
                                                : operation.toLowerCase() === 'delete'
                                                  ? 'Remove records'
                                                  : `${operation} operation`}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Role Permissions Section */}
                              {feature.rolePermissions &&
                                Object.keys(feature.rolePermissions).length > 0 && (
                                  <Disclosure as="div" defaultOpen={false}>
                                    {({ open: permissionsOpen }) => (
                                      <>
                                        <Disclosure.Button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                          <span>
                                            Role Permissions (
                                            {feature.rolePermissions
                                              ? Object.keys(feature.rolePermissions).length
                                              : 0}{' '}
                                            roles)
                                          </span>
                                          <ChevronDownIcon
                                            className={`h-4 w-4 transition-transform duration-200 ${
                                              permissionsOpen ? 'rotate-180' : ''
                                            }`}
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="mt-3 space-y-3">
                                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {feature.rolePermissions &&
                                              Object.entries(feature.rolePermissions).map(
                                                ([role, permissions], permIndex) => (
                                                  <div
                                                    key={permIndex}
                                                    className="rounded-md border border-gray-200 bg-gray-50 p-3"
                                                  >
                                                    <h5 className="mb-2 text-sm font-medium capitalize text-gray-900">
                                                      {role.replace('_', ' ')}
                                                    </h5>
                                                    <div className="flex flex-wrap gap-1">
                                                      {Array.isArray(permissions) ? (
                                                        permissions.map(
                                                          (permission, permSubIndex) => (
                                                            <span
                                                              key={permSubIndex}
                                                              className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                                                            >
                                                              {permission}
                                                            </span>
                                                          ),
                                                        )
                                                      ) : (
                                                        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                          {permissions}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                          </div>
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                )}

                              {/* Related Entities Section */}
                              {feature.relatedEntities && feature.relatedEntities.length > 0 && (
                                <div>
                                  <h4 className="mb-3 text-base font-medium text-gray-900">
                                    Related Entities
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {feature.relatedEntities.map((entityName, entityIndex) => (
                                      <span
                                        key={entityIndex}
                                        className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                                      >
                                        {entityName}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Mock Implementation Note */}
                              <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs italic text-gray-500">
                                  This feature is part of the AI-generated app structure for preview
                                  purposes.
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
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{generationResult.features.length} features</span>{' '}
                    available in this application. Click on any feature above to view detailed CRUD
                    operations, role permissions, and related entities.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

GeneratedApp.displayName = 'GeneratedApp';

export default GeneratedApp;
