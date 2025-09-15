import React, { useState } from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface AdminDashboardProps {
  entity: Entity
}

interface MetricCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: string
  color: string
}

interface ChartData {
  label: string
  value: number
  color: string
}

const AdminDashboard = ({ entity }: AdminDashboardProps): React.ReactElement => {
  const [timeRange, setTimeRange] = useState('7d')

  // Generate mock dashboard metrics
  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.3%',
      trend: 'up',
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Active Sessions',
      value: '2,341',
      change: '+5.2%',
      trend: 'up',
      icon: '🟢',
      color: 'green'
    },
    {
      title: 'System Load',
      value: '67%',
      change: '-3.1%',
      trend: 'down',
      icon: '⚡',
      color: 'yellow'
    },
    {
      title: 'Error Rate',
      value: '0.12%',
      change: '+0.05%',
      trend: 'up',
      icon: '⚠️',
      color: 'red'
    },
    {
      title: 'Revenue',
      value: '$54.2k',
      change: '+18.7%',
      trend: 'up',
      icon: '💰',
      color: 'emerald'
    },
    {
      title: 'Storage Used',
      value: '847 GB',
      change: '+2.1 GB',
      trend: 'up',
      icon: '💾',
      color: 'purple'
    }
  ]

  // Generate mock chart data
  const userGrowthData: ChartData[] = [
    { label: 'Jan', value: 85, color: 'bg-blue-500' },
    { label: 'Feb', value: 92, color: 'bg-blue-500' },
    { label: 'Mar', value: 78, color: 'bg-blue-500' },
    { label: 'Apr', value: 95, color: 'bg-blue-500' },
    { label: 'May', value: 88, color: 'bg-blue-500' },
    { label: 'Jun', value: 100, color: 'bg-blue-500' },
  ]

  const systemHealthData: ChartData[] = [
    { label: 'CPU', value: 65, color: 'bg-green-500' },
    { label: 'Memory', value: 78, color: 'bg-yellow-500' },
    { label: 'Disk', value: 45, color: 'bg-blue-500' },
    { label: 'Network', value: 82, color: 'bg-purple-500' },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Mock recent activities
  const recentActivities = [
    { id: 1, user: 'System', action: 'Database backup completed', time: '2 min ago', type: 'success' },
    { id: 2, user: 'Admin', action: 'New user registered: john.doe@example.com', time: '5 min ago', type: 'info' },
    { id: 3, user: 'System', action: 'Failed login attempt detected', time: '8 min ago', type: 'warning' },
    { id: 4, user: 'Moderator', action: 'Content moderation action taken', time: '12 min ago', type: 'info' },
    { id: 5, user: 'System', action: 'Cache cleared successfully', time: '15 min ago', type: 'success' },
  ]

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          {entity.name} Dashboard
        </h3>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            ⚙️ System Admin
          </span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-${metric.color}-100 text-${metric.color}-800`}>
                <span className={getTrendColor(metric.trend)}>{getTrendIcon(metric.trend)}</span> {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            📊 User Growth Trend
          </h4>
          <div className="flex items-end space-x-2 h-32">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${data.color} rounded-t-sm transition-all hover:opacity-80`}
                  style={{ height: `${data.value}%` }}
                />
                <span className="text-xs text-gray-600 mt-2">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Chart */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            🏥 System Health
          </h4>
          <div className="space-y-3">
            {systemHealthData.map((data, index) => (
              <div key={index} className="flex items-center">
                <span className="w-16 text-sm text-gray-600">{data.label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                  <div
                    className={`${data.color} h-3 rounded-full transition-all`}
                    style={{ width: `${data.value}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-medium text-gray-900">{data.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
          ⚡ Recent System Activity
        </h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-white transition-colors">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}:</span> {activity.action}
                  </p>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{activity.time}</span>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getActivityColor(activity.type)}`}>
                  {activity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          🔄 Refresh Data
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          📊 Export Report
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          ⚙️ System Settings
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          🚨 Emergency Actions
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard