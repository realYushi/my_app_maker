import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'
import AdminDashboard from './AdminDashboard'
import SystemMetrics from './SystemMetrics'
import AdminControlPanel from './AdminControlPanel'

interface AdminSystemDisplayProps {
  entity: Entity
}

const AdminSystemDisplay = ({ entity }: AdminSystemDisplayProps): React.ReactElement => {
  // Determine which admin component to show based on entity attributes and name
  const entityName = entity.name.toLowerCase()
  const attributes = entity.attributes.map(attr => attr.toLowerCase())

  // Check for dashboard context
  const isDashboardContext = attributes.some(attr =>
    attr.includes('dashboard') ||
    attr.includes('overview') ||
    attr.includes('summary') ||
    attr.includes('kpi') ||
    attr.includes('metric')
  ) || entityName.includes('dashboard') || entityName.includes('overview')

  // Check for metrics/monitoring context
  const isMetricsContext = attributes.some(attr =>
    attr.includes('metric') ||
    attr.includes('monitoring') ||
    attr.includes('performance') ||
    attr.includes('health') ||
    attr.includes('system') ||
    attr.includes('server')
  ) || entityName.includes('metric') || entityName.includes('monitor') || entityName.includes('health')

  // Check for control/configuration context
  const isControlContext = attributes.some(attr =>
    attr.includes('control') ||
    attr.includes('config') ||
    attr.includes('setting') ||
    attr.includes('admin') ||
    attr.includes('manage') ||
    attr.includes('maintenance')
  ) || entityName.includes('control') || entityName.includes('config') || entityName.includes('setting')

  // Decide which component to render based on context
  if (isDashboardContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            ⚙️ Admin Dashboard
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Comprehensive administrative dashboard with system metrics, user analytics, and operational controls.
        </div>
        <AdminDashboard entity={entity} />
      </div>
    )
  }

  if (isMetricsContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            📊 System Metrics
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Real-time system monitoring with performance metrics, health indicators, and automated alerts.
        </div>
        <SystemMetrics entity={entity} />
      </div>
    )
  }

  if (isControlContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            {entity.name}
          </h3>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
            🎛️ Control Panel
          </span>
        </div>
        <div className="mb-3 text-sm text-gray-600">
          Advanced system configuration and control panel with settings management and critical system actions.
        </div>
        <AdminControlPanel entity={entity} />
      </div>
    )
  }

  // Default to admin dashboard for general admin entities
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow border-l-4 border-l-red-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          {entity.name}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
          ⚙️ System Admin
        </span>
      </div>
      <div className="mb-3 text-sm text-gray-600">
        System administration and configuration management interface.
      </div>
      <AdminDashboard entity={entity} />
    </div>
  )
}

export default AdminSystemDisplay