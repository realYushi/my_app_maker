import { memo, useMemo } from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface EntityFormProps {
  entity: Entity
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

const EntityForm = memo(({ entity }: EntityFormProps) => {
  // Memoize field data to prevent recalculation
  const fieldData = useMemo(() => {
    return entity.attributes.map(attribute => ({
      name: attribute,
      type: getInputType(attribute),
      placeholder: getPlaceholder(attribute)
    }))
  }, [entity.attributes])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{entity.name}</h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {entity.attributes.length} fields
        </span>
      </div>

      <form className="space-y-4">
        {fieldData.map((field, index) => (
          <div key={index}>
            <label
              htmlFor={`${entity.name}-${field.name}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.name}
            </label>
            {field.name.toLowerCase().includes('description') || field.name.toLowerCase().includes('notes') ? (
              <textarea
                id={`${entity.name}-${field.name}`}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder={field.placeholder}
                disabled
              />
            ) : field.name.toLowerCase().includes('category') || field.name.toLowerCase().includes('status') || field.name.toLowerCase().includes('type') ? (
              <select
                id={`${entity.name}-${field.name}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              >
                <option value="">Select {field.name.toLowerCase()}</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            ) : (
              <input
                type={field.type}
                id={`${entity.name}-${field.name}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={field.placeholder}
                disabled
              />
            )}
          </div>
        ))}

        <div className="flex space-x-3 pt-4">
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
      </form>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 italic">
          This is a non-functional form for preview purposes only.
        </p>
      </div>
    </div>
  )
})

EntityForm.displayName = 'EntityForm'

export default EntityForm