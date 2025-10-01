/** @jsxImportSource react */
import EntityForm from '../../features/generation/EntityForm';
import type { DomainComponent } from '../componentFactory';

// E-commerce specific components (keeping existing order and customer forms for backward compatibility)
export const EcommerceOrderForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-green-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        📦 Order Management
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);

export const EcommerceCustomerForm: DomainComponent = ({ entity }) => (
  <div className="rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-4 transition-shadow hover:shadow-md">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
        {entity.name}
      </h3>
      <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
        👤 Customer Profile
      </span>
    </div>
    <EntityForm entity={entity} />
  </div>
);
