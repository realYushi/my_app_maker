import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import RolePermissionPanel from './RolePermissionPanel'

interface UserRoleDisplayProps {
  entity: Entity
}

const UserRoleDisplay = ({ entity }: UserRoleDisplayProps): React.ReactElement => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          🔐 Access Control
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600">
        Role-based access control and permission management interface with matrix-style configuration.
      </div>
      <RolePermissionPanel entity={entity} />
    </div>
  )
}

export default UserRoleDisplay