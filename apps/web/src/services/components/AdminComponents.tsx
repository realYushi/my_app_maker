/** @jsxImportSource react */
import EntityForm from '../../features/generation/EntityForm';
import type { DomainComponent } from '../componentFactory';

export const AdminSystemForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-red-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
        ⚙️ System Admin
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);

export const AdminReportForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-orange-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-orange-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
        📊 Reports & Analytics
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);

export const AdminAuditForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-yellow-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
        🔍 Audit & Compliance
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);

export const AdminSettingsForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-gray-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-gray-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
        ⚙️ Configuration
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);
