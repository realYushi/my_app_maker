import { memo, useMemo, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface EntityFormProps {
  entity: Entity
  tabKey?: number
}

// Helper functions moved outside component to prevent recreation
const getInputType = (attribute: string): string => {
  const lowercaseAttr = attribute.toLowerCase()
  if (lowercaseAttr.includes('email')) return 'email'
  if (lowercaseAttr.includes('password')) return 'password'
  if (lowercaseAttr.includes('phone')) return 'tel'
  if (lowercaseAttr.includes('date') || lowercaseAttr.includes('created') || lowercaseAttr.includes('updated')) return 'date'
  if (lowercaseAttr.includes('age') || lowercaseAttr.includes('count') || lowercaseAttr.includes('number')) return 'number'
  if (lowercaseAttr.includes('url') || lowercaseAttr.includes('link') || lowercaseAttr.includes('website')) return 'url'
  return 'text'
}

const getPlaceholder = (attribute: string): string => {
  return `Enter ${attribute.toLowerCase()}`
}

const EntityForm = memo(({ entity, tabKey = undefined }: EntityFormProps) => {
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary')

  // Note: tabKey is accepted for interface consistency but not used in EntityForm
  // The tabKey prop is primarily used in UserManagementTable for search reset functionality
  void tabKey // Explicitly void unused parameter

  // Memoize field data to prevent recalculation
  const fieldData = useMemo(() => {
    return entity.attributes.map(attribute => ({
      name: attribute,
      type: getInputType(attribute),
      placeholder: getPlaceholder(attribute)
    }))
  }, [entity.attributes])

  // Categorize fields for progressive disclosure
  const categorizedFields = useMemo(() => {
    const essential = fieldData.filter(field =>
      field.name.toLowerCase().includes('name') ||
      field.name.toLowerCase().includes('title') ||
      field.name.toLowerCase().includes('id')
    )
    const detailed = fieldData.filter(field => !essential.includes(field))

    return { essential, detailed }
  }, [fieldData])

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Entity Header with Progressive Disclosure Controls */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TableCellsIcon className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{entity.name}</h3>
              <p className="text-sm text-gray-600">{entity.attributes.length} total fields</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'summary' ? 'detailed' : 'summary')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                viewMode === 'detailed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {viewMode === 'summary' ? 'Show Details' : 'Show Summary'}
            </button>
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              Entity
            </span>
          </div>
        </div>
      </div>

      {/* Progressive Content Disclosure */}
      <div className="p-4 sm:p-6">
        {viewMode === 'summary' ? (
          // Summary View - Show essential fields only
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categorizedFields.essential.length > 0 ? (
                categorizedFields.essential.map((field, index) => (
                  <div key={index} className="space-y-1">
                    <label htmlFor={`summary-${field.name}`} className="block text-sm font-medium text-gray-700">
                      {field.name}
                    </label>
                    <input
                      id={`summary-${field.name}`}
                      type={field.type}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder={field.placeholder}
                      disabled
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-gray-500">
                  <TableCellsIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No essential fields detected. Click "Show Details" to view all fields.</p>
                </div>
              )}
            </div>

            {categorizedFields.detailed.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">
                  {categorizedFields.detailed.length} additional fields available in detailed view
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled
              >
                Quick Save {entity.name}
              </button>
            </div>
          </div>
        ) : (
          // Detailed View - Show all fields with collapsible sections
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <div className="space-y-4">
                {/* Essential Fields Section */}
                {categorizedFields.essential.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-gray-900">Essential Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categorizedFields.essential.map((field, index) => (
                        <div key={index} className="space-y-1">
                          <label htmlFor={`essential-${field.name}`} className="block text-sm font-medium text-gray-700">
                            {field.name}
                          </label>
                          <input
                            id={`essential-${field.name}`}
                            type={field.type}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder={field.placeholder}
                            disabled
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Fields Section - Start opened in detailed mode */}
                {categorizedFields.detailed.length > 0 && (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span>Additional Fields ({categorizedFields.detailed.length})</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-200 ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </Disclosure.Button>

                    <Disclosure.Panel className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {categorizedFields.detailed.map((field, index) => (
                          <div key={index} className="space-y-1">
                            <label htmlFor={`detailed-${field.name}`} className="block text-sm font-medium text-gray-700">
                              {field.name}
                            </label>
                            {field.name.toLowerCase().includes('description') || field.name.toLowerCase().includes('notes') ? (
                              <textarea
                                id={`detailed-${field.name}`}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                placeholder={field.placeholder}
                                disabled
                              />
                            ) : field.name.toLowerCase().includes('category') || field.name.toLowerCase().includes('status') || field.name.toLowerCase().includes('type') ? (
                              <select
                                id={`detailed-${field.name}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                disabled
                              >
                                <option value="">Select {field.name.toLowerCase()}</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                              </select>
                            ) : (
                              <input
                                id={`detailed-${field.name}`}
                                type={field.type}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder={field.placeholder}
                                disabled
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled
                  >
                    Save {entity.name}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Disclosure>
        )}

        {/* Form Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">
            This is a non-functional form for preview purposes only.
            {viewMode === 'summary' ? ' Switch to detailed view for all fields.' : ' Switch to summary view for essential fields only.'}
          </p>
        </div>
      </div>
    </div>
  )
})

EntityForm.displayName = 'EntityForm'

export default EntityForm