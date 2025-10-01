import React from 'react';

interface SortOption {
  value: string;
  label: string;
}

interface ProductSortProps {
  onSortChange?: (sortBy: string) => void;
  currentSort?: string;
  resultCount?: number;
}

const ProductSort: React.FC<ProductSortProps> = ({
  onSortChange,
  currentSort = 'relevance',
  resultCount = 0,
}) => {
  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.target.value;
    onSortChange?.(newSort);
  };

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {resultCount > 0 ? (
          <span>
            Showing <span className="font-medium">{resultCount}</span> result
            {resultCount !== 1 ? 's' : ''}
          </span>
        ) : (
          <span>No results found</span>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="whitespace-nowrap text-sm font-medium text-gray-700"
          >
            Sort by:
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={handleSortChange}
            className="min-w-[160px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Options */}
        <div className="hidden items-center gap-1 rounded-md border border-gray-300 p-1 sm:flex">
          <button
            className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            title="Grid view"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            className="rounded p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="List view"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSort;
