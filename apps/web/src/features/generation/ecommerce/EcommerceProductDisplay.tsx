import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';
import ProductCard from './ProductCard';
import CatalogGrid from './CatalogGrid';

interface EcommerceProductDisplayProps {
  entity: Entity;
}

const EcommerceProductDisplay = ({ entity }: EcommerceProductDisplayProps): React.ReactElement => {
  // Check if this should be a catalog view (multiple products) or single product
  const isCatalog = entity.attributes.some(
    attr =>
      attr.toLowerCase().includes('catalog') ||
      attr.toLowerCase().includes('list') ||
      attr.toLowerCase().includes('grid') ||
      entity.name.toLowerCase().includes('catalog'),
  );

  if (isCatalog) {
    // Create mock entities for catalog display
    const mockEntities = [
      entity,
      { name: `Related ${entity.name} A`, attributes: entity.attributes },
      { name: `Related ${entity.name} B`, attributes: entity.attributes },
      { name: `Related ${entity.name} C`, attributes: entity.attributes },
    ];

    return (
      <div className="rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-6 transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-medium text-gray-900">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            🛍️ Product Catalog
          </span>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          Product catalog interface with advanced e-commerce features including filtering, sorting,
          and grid layouts.
        </div>
        <CatalogGrid entities={mockEntities} title={entity.name} showFilters={true} />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-l-4 border-gray-200 border-l-blue-500 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          🛍️ Product Card
        </span>
      </div>
      <div className="mb-4 text-sm text-gray-600">
        Enhanced product display with pricing, ratings, and add-to-cart functionality.
      </div>
      <div className="max-w-sm">
        <ProductCard entity={entity} />
      </div>
    </div>
  );
};

export default EcommerceProductDisplay;
