import React, { useState } from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface RolePermissionPanelProps {
  entity: Entity;
}

const RolePermissionPanel = ({ entity }: RolePermissionPanelProps): React.ReactElement => {
  const [selectedRole, setSelectedRole] = useState('Admin');

  // Mock permission data structure
  const permissionCategories = [
    {
      name: 'User Management',
      permissions: [
        { id: 'users_view', name: 'View Users', description: 'View user profiles and information' },
        { id: 'users_create', name: 'Create Users', description: 'Add new users to the system' },
        {
          id: 'users_edit',
          name: 'Edit Users',
          description: 'Modify user profiles and information',
        },
        { id: 'users_delete', name: 'Delete Users', description: 'Remove users from the system' },
      ],
    },
    {
      name: 'Content Management',
      permissions: [
        {
          id: 'content_view',
          name: 'View Content',
          description: 'View published and draft content',
        },
        {
          id: 'content_create',
          name: 'Create Content',
          description: 'Create new content and posts',
        },
        { id: 'content_edit', name: 'Edit Content', description: 'Modify existing content' },
        {
          id: 'content_publish',
          name: 'Publish Content',
          description: 'Publish content to public',
        },
        { id: 'content_delete', name: 'Delete Content', description: 'Remove content permanently' },
      ],
    },
    {
      name: 'System Administration',
      permissions: [
        {
          id: 'system_config',
          name: 'System Config',
          description: 'Access system configuration settings',
        },
        {
          id: 'system_logs',
          name: 'View Logs',
          description: 'Access system logs and audit trails',
        },
        {
          id: 'system_backup',
          name: 'Backup Management',
          description: 'Create and manage system backups',
        },
        {
          id: 'system_maintenance',
          name: 'Maintenance Mode',
          description: 'Enable/disable maintenance mode',
        },
      ],
    },
  ];

  // Mock role configurations
  const rolePermissions = {
    Admin: {
      color: 'red',
      icon: '👑',
      permissions: new Set([
        'users_view',
        'users_create',
        'users_edit',
        'users_delete',
        'content_view',
        'content_create',
        'content_edit',
        'content_publish',
        'content_delete',
        'system_config',
        'system_logs',
        'system_backup',
        'system_maintenance',
      ]),
    },
    Manager: {
      color: 'blue',
      icon: '🔧',
      permissions: new Set([
        'users_view',
        'users_edit',
        'content_view',
        'content_create',
        'content_edit',
        'content_publish',
        'system_logs',
      ]),
    },
    Editor: {
      color: 'green',
      icon: '✏️',
      permissions: new Set(['users_view', 'content_view', 'content_create', 'content_edit']),
    },
    Member: {
      color: 'gray',
      icon: '👤',
      permissions: new Set(['content_view']),
    },
  };

  const currentRoleConfig = rolePermissions[selectedRole as keyof typeof rolePermissions];

  const [editMode, setEditMode] = useState(false);
  const [tempPermissions, setTempPermissions] = useState(currentRoleConfig.permissions);

  const togglePermission = (permissionId: string) => {
    if (!editMode) return;

    const newPermissions = new Set(tempPermissions);
    if (newPermissions.has(permissionId)) {
      newPermissions.delete(permissionId);
    } else {
      newPermissions.add(permissionId);
    }
    setTempPermissions(newPermissions);
  };

  const saveChanges = () => {
    // In a real app, this would save to backend
    setEditMode(false);
    // Update the role permissions (in real app, this would be an API call)
  };

  const cancelChanges = () => {
    setTempPermissions(currentRoleConfig.permissions);
    setEditMode(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
          {entity.name} Permissions
        </h3>
        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          🔐 Access Control
        </span>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Select Role to Configure
        </label>
        <div className="flex space-x-2">
          {Object.keys(rolePermissions).map(role => {
            const config = rolePermissions[role as keyof typeof rolePermissions];
            return (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  setEditMode(false);
                  setTempPermissions(config.permissions);
                }}
                className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  selectedRole === role
                    ? `bg-${config.color}-100 text-${config.color}-800 border-${config.color}-300`
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{config.icon}</span>
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-${currentRoleConfig.color}-100 text-${currentRoleConfig.color}-800`}
          >
            <span className="mr-1">{currentRoleConfig.icon}</span>
            {selectedRole} Role Configuration
          </span>
        </div>
        <div className="flex space-x-2">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ✏️ Edit Permissions
            </button>
          ) : (
            <>
              <button
                onClick={saveChanges}
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                ✓ Save Changes
              </button>
              <button
                onClick={cancelChanges}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                ✕ Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="space-y-6">
        {permissionCategories.map(category => (
          <div key={category.name} className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 flex items-center text-base font-medium text-gray-900">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              {category.name}
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {category.permissions.map(permission => {
                const isGranted = editMode
                  ? tempPermissions.has(permission.id)
                  : currentRoleConfig.permissions.has(permission.id);

                return (
                  <div
                    key={permission.id}
                    className={`rounded-lg border p-3 transition-all ${
                      editMode ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'
                    } ${isGranted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                    onClick={() => togglePermission(permission.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div
                            className={`mr-3 flex h-4 w-4 items-center justify-center rounded border-2 ${
                              isGranted
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isGranted && (
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{permission.name}</h5>
                            <p className="mt-1 text-xs text-gray-500">{permission.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Summary */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-900">Permission Summary</h4>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{selectedRole}</span> role has{' '}
          <span className="font-medium text-green-600">
            {editMode ? tempPermissions.size : currentRoleConfig.permissions.size}
          </span>{' '}
          out of{' '}
          <span className="font-medium">
            {permissionCategories.reduce((total, cat) => total + cat.permissions.length, 0)}
          </span>{' '}
          total permissions.
        </div>
      </div>
    </div>
  );
};

export default RolePermissionPanel;
