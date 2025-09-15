import React, { useState } from 'react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface ProductFiltersProps {
  onFilterChange?: (filters: FilterState) => void
  categories?: FilterOption[]
  brands?: FilterOption[]
}

interface FilterState {
  categories: string[]
  priceRange: [number, number]
  rating: number
  brands: string[]
  inStock: boolean
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  categories = [
    { id: 'electronics', label: 'Electronics', count: 45 },
    { id: 'clothing', label: 'Clothing', count: 32 },
    { id: 'books', label: 'Books', count: 28 },
    { id: 'home', label: 'Home & Garden', count: 19 },
    { id: 'sports', label: 'Sports', count: 15 }
  ],
  brands = [
    { id: 'apple', label: 'Apple', count: 12 },
    { id: 'samsung', label: 'Samsung', count: 8 },
    { id: 'nike', label: 'Nike', count: 15 },
    { id: 'adidas', label: 'Adidas', count: 11 }
  ]
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    brands: [],
    inStock: false
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange?.(updatedFilters)
  }

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    handleFilterChange({ categories: newCategories })
  }

  const toggleBrand = (brandId: string) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(id => id !== brandId)
      : [...filters.brands, brandId]
    handleFilterChange({ brands: newBrands })
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      priceRange: [0, 1000] as [number, number],
      rating: 0,
      brands: [],
      inStock: false
    }
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.rating > 0 ||
    filters.inStock ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden border-b border-gray-200 p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Filters</span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters Content */}
      <div className={`lg:block ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="p-4 space-y-6">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active filters</span>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Categories */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1">
                    {category.label}
                  </span>
                  {category.count && (
                    <span className="text-xs text-gray-500">({category.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange({
                    priceRange: [Number(e.target.value), filters.priceRange[1]]
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange({
                    priceRange: [filters.priceRange[0], Number(e.target.value)]
                  })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="text-xs text-gray-500">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Customer Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleFilterChange({ rating })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 flex items-center">
                    <span className="text-yellow-400">
                      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                    </span>
                    <span className="ml-1 text-sm text-gray-700">& up</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.id)}
                    onChange={() => toggleBrand(brand.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1">
                    {brand.label}
                  </span>
                  {brand.count && (
                    <span className="text-xs text-gray-500">({brand.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">In stock only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters