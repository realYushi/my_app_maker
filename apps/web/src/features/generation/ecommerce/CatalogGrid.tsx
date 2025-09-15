import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import ProductCard from './ProductCard'

interface CatalogGridProps {
  entities: Entity[]
  title?: string
  showFilters?: boolean
}

const CatalogGrid: React.FC<CatalogGridProps> = ({
  entities,
  title = 'Product Catalog',
  showFilters = false
}) => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">
              Showing {entities.length} product{entities.length !== 1 ? 's' : ''}
            </p>
          </div>

          {showFilters && (
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button className="p-2 text-gray-600 bg-white rounded shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {entities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {entities.map((entity, index) => (
            <ProductCard
              key={`${entity.name}-${index}`}
              entity={entity}
              inStock={index < entities.length * 0.9} // First 90% are in stock
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination Placeholder */}
      {entities.length > 12 && (
        <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-200">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
              2
            </button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
              3
            </button>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default CatalogGrid