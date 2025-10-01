/** @jsxImportSource react */
import EntityForm from '../../features/generation/EntityForm';
import type { DomainComponent } from '../componentFactory';

export const UserManagementUserForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-purple-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-purple-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
        👥 User Management
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);

export const UserManagementRoleForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-indigo-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
        🔐 Role & Permissions
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);
