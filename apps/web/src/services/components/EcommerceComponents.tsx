/** @jsxImportSource react */
import EntityForm from '../../features/generation/EntityForm'
import type { DomainComponent } from '../componentFactory'

// E-commerce specific components (keeping existing order and customer forms for backward compatibility)
export const EcommerceOrderForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        📦 Order Management
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)

export const EcommerceCustomerForm: DomainComponent = ({ entity }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
        👤 Customer Profile
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
)