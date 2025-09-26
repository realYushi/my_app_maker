import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';
import RolePermissionPanel from './RolePermissionPanel';

interface UserRoleDisplayProps {
  entity: Entity;
}

const UserRoleDisplay = ({ entity }: UserRoleDisplayProps): React.ReactElement => {
  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
      style={{ borderLeft: '4px solid #eab308' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          🔐 Access Control
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600">
        Role-based access control and permission management interface with matrix-style
        configuration.
      </div>
      <RolePermissionPanel entity={entity} />
    </div>
  );
};

export default UserRoleDisplay;
