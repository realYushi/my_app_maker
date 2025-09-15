import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import UserProfile from './UserProfile'
import UserManagementTable from './UserManagementTable'
import UserActivityFeed from './UserActivityFeed'

interface UserManagementDisplayProps {
  entity: Entity
}

const UserManagementDisplay = ({ entity }: UserManagementDisplayProps): React.ReactElement => {
  // Determine which component to show based on entity attributes and name
  const entityName = entity.name.toLowerCase()
  const attributes = entity.attributes.map(attr => attr.toLowerCase())

  // Check for profile/user display context
  const isProfileContext = attributes.some(attr =>
    attr.includes('profile') ||
    attr.includes('avatar') ||
    attr.includes('bio') ||
    attr.includes('personal')
  ) || entityName.includes('profile')

  // Check for table/listing context
  const isTableContext = attributes.some(attr =>
    attr.includes('table') ||
    attr.includes('list') ||
    attr.includes('directory') ||
    attr.includes('search') ||
    attr.includes('filter')
  ) || entityName.includes('table') || entityName.includes('list') || entityName.includes('directory')

  // Check for activity/feed context
  const isActivityContext = attributes.some(attr =>
    attr.includes('activity') ||
    attr.includes('feed') ||
    attr.includes('log') ||
    attr.includes('history') ||
    attr.includes('timeline')
  ) || entityName.includes('activity') || entityName.includes('feed')

  // Decide which component to render based on context
  if (isActivityContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
            📊 User Activity
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Real-time user activity monitoring with filtering and analytics.
        </div>
        <UserActivityFeed entity={entity} />
      </div>
    )
  }

  if (isTableContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            👥 User Directory
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Comprehensive user management interface with search, filtering, and bulk operations.
        </div>
        <UserManagementTable entity={entity} />
      </div>
    )
  }

  if (isProfileContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
            👤 User Profile
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Enhanced user profile display with avatar, role indicators, and activity status.
        </div>
        <UserProfile entity={entity} />
      </div>
    )
  }

  // Default to user management table for general user entities
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          👤 User Management
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600">
        User account management with authentication and profile settings.
      </div>
      <UserManagementTable entity={entity} />
    </div>
  )
}

export default UserManagementDisplay