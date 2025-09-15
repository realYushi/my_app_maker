import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import ProductCard from './ProductCard'
import CatalogGrid from './CatalogGrid'

interface EcommerceProductDisplayProps {
  entity: Entity
}

const EcommerceProductDisplay = ({ entity }: EcommerceProductDisplayProps): React.ReactElement => {
  // Check if this should be a catalog view (multiple products) or single product
  const isCatalog = entity.attributes.some(attr =>
    attr.toLowerCase().includes('catalog') ||
    attr.toLowerCase().includes('list') ||
    attr.toLowerCase().includes('grid') ||
    entity.name.toLowerCase().includes('catalog')
  )

  if (isCatalog) {
    // Create mock entities for catalog display
    const mockEntities = [
      entity,
      { name: 'Related ' + entity.name + ' A', attributes: entity.attributes },
      { name: 'Related ' + entity.name + ' B', attributes: entity.attributes },
      { name: 'Related ' + entity.name + ' C', attributes: entity.attributes }
    ]

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            🛍️ Product Catalog
          </span>
        </div>
        <div className="mb-4 text-sm text-gray-600">
          Product catalog interface with advanced e-commerce features including filtering, sorting, and grid layouts.
        </div>
        <CatalogGrid entities={mockEntities} title={entity.name} showFilters={true} />
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
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
  )
}

export default EcommerceProductDisplay