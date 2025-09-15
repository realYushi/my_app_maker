import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import DataVisualization from './DataVisualization'

interface AdminReportDisplayProps {
  entity: Entity
}

const AdminReportDisplay = ({ entity }: AdminReportDisplayProps): React.ReactElement => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          📊 Analytics & Reports
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600">
        Advanced analytics dashboard with interactive charts, data visualization, and comprehensive reporting capabilities.
      </div>
      <DataVisualization entity={entity} />
    </div>
  )
}

export default AdminReportDisplay