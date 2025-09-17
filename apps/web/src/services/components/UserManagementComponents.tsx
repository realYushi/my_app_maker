/** @jsxImportSource react */
import EntityForm from '../../features/generation/EntityForm'
import type { DomainComponent } from '../componentFactory'

export const UserManagementUserForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
        👥 User Management
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)

export const UserManagementRoleForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
        🔐 Role & Permissions
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)