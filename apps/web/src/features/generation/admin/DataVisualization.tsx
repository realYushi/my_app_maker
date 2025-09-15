import React, { useState } from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface DataVisualizationProps {
  entity: Entity
}

interface TimeSeriesData {
  timestamp: string
  value: number
  label: string
}

const DataVisualization = ({ entity }: DataVisualizationProps): React.ReactElement => {
  const [selectedChart, setSelectedChart] = useState('users')
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for different chart types
  const chartConfigs = {
    users: {
      title: 'User Analytics',
      icon: '👥',
      color: 'blue',
      data: [
        { label: 'New Users', value: 1247, color: 'bg-blue-500', percentage: 45 },
        { label: 'Active Users', value: 2134, color: 'bg-green-500', percentage: 35 },
        { label: 'Returning Users', value: 892, color: 'bg-purple-500', percentage: 20 }
      ]
    },
    revenue: {
      title: 'Revenue Analytics',
      icon: '💰',
      color: 'green',
      data: [
        { label: 'Subscriptions', value: 45670, color: 'bg-green-500', percentage: 60 },
        { label: 'One-time Sales', value: 23450, color: 'bg-blue-500', percentage: 30 },
        { label: 'Refunds', value: 5670, color: 'bg-red-500', percentage: 10 }
      ]
    },
    performance: {
      title: 'Performance Metrics',
      icon: '⚡',
      color: 'yellow',
      data: [
        { label: 'Fast Response', value: 85, color: 'bg-green-500', percentage: 85 },
        { label: 'Moderate Response', value: 12, color: 'bg-yellow-500', percentage: 12 },
        { label: 'Slow Response', value: 3, color: 'bg-red-500', percentage: 3 }
      ]
    },
    content: {
      title: 'Content Analytics',
      icon: '📊',
      color: 'purple',
      data: [
        { label: 'Blog Posts', value: 234, color: 'bg-purple-500', percentage: 40 },
        { label: 'Pages', value: 89, color: 'bg-blue-500', percentage: 25 },
        { label: 'Media Files', value: 156, color: 'bg-green-500', percentage: 35 }
      ]
    }
  }

  // Generate time series data
  const generateTimeSeriesData = (days: number): TimeSeriesData[] => {
    const data: TimeSeriesData[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const baseValue = 100 + Math.sin(i * 0.5) * 30
      const randomVariation = (Math.random() - 0.5) * 20

      data.push({
        timestamp: date.toISOString().split('T')[0],
        value: Math.max(0, baseValue + randomVariation),
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    }

    return data
  }

  const currentChart = chartConfigs[selectedChart as keyof typeof chartConfigs]
  const timeSeriesData = generateTimeSeriesData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)
  const maxTimeSeriesValue = Math.max(...timeSeriesData.map(d => d.value))

  // Calculate summary stats
  const totalValue = currentChart.data.reduce((sum, item) => sum + item.value, 0)
  const avgGrowth = '+12.5%' // Mock growth rate

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          {entity.name} Analytics
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          📈 Data Visualization
        </span>
      </div>

      {/* Chart Selection and Time Range */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {Object.entries(chartConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedChart(key)}
                className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedChart === key
                    ? `bg-${config.color}-100 text-${config.color}-800 border border-${config.color}-300`
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{config.icon}</span>
                {config.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total {currentChart.title}</p>
              <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()}</p>
            </div>
            <span className="text-2xl">{currentChart.icon}</span>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Growth</p>
              <p className="text-2xl font-bold text-green-600">{avgGrowth}</p>
            </div>
            <span className="text-2xl">📈</span>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">{currentChart.data.length}</p>
            </div>
            <span className="text-2xl">🔢</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            📊 {currentChart.title} Distribution
          </h4>
          <div className="space-y-4">
            {currentChart.data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 flex-shrink-0">{item.label}</div>
                <div className="flex-1 mx-4">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`${item.color} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      >
                        <span className="text-white text-xs font-medium">{item.percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-sm font-medium text-gray-900 text-right">
                  {item.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            📈 Trend Over Time ({timeRange})
          </h4>
          <div className="flex items-end space-x-1 h-40">
            {timeSeriesData.map((point, index) => {
              const height = (point.value / maxTimeSeriesValue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full bg-${currentChart.color}-500 rounded-t-sm transition-all hover:opacity-80 cursor-pointer`}
                    style={{ height: `${height}%` }}
                    title={`${point.label}: ${Math.round(point.value)}`}
                  />
                  <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                    {point.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="mt-6 border border-gray-200 rounded-lg p-4">
        <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
          📋 Detailed Breakdown
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentChart.data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${item.color} rounded-full mr-3`} />
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.percentage && item.percentage > 50 ? 'bg-green-100 text-green-800' :
                      item.percentage && item.percentage > 20 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.percentage && item.percentage > 50 ? '✅ High' :
                       item.percentage && item.percentage > 20 ? '⚠️ Medium' : '🔻 Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export and Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          📊 Export Chart
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          📈 Full Screen View
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          🔄 Refresh Data
        </button>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          📋 Export CSV
        </button>
      </div>
    </div>
  )
}

export default DataVisualization