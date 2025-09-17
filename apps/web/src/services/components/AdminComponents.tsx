/** @jsxImportSource react */
import EntityForm from '../../features/generation/EntityForm'
import type { DomainComponent } from '../componentFactory'

export const AdminSystemForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
        ⚙️ System Admin
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)

export const AdminReportForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
        📊 Reports & Analytics
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)

export const AdminAuditForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        🔍 Audit & Compliance
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)

export const AdminSettingsForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-gray-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
        ⚙️ Configuration
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)