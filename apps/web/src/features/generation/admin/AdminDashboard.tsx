import React, { useState } from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface AdminDashboardProps {
  entity: Entity;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const AdminDashboard = ({ entity }: AdminDashboardProps): React.ReactElement => {
  const [timeRange, setTimeRange] = useState('7d');

  // Generate mock dashboard metrics
  const metrics: MetricCard[] = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.3%',
      trend: 'up',
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Active Sessions',
      value: '2,341',
      change: '+5.2%',
      trend: 'up',
      icon: '🟢',
      color: 'green',
    },
    {
      title: 'System Load',
      value: '67%',
      change: '-3.1%',
      trend: 'down',
      icon: '⚡',
      color: 'yellow',
    },
    {
      title: 'Error Rate',
      value: '0.12%',
      change: '+0.05%',
      trend: 'up',
      icon: '⚠️',
      color: 'red',
    },
    {
      title: 'Revenue',
      value: '$54.2k',
      change: '+18.7%',
      trend: 'up',
      icon: '💰',
      color: 'emerald',
    },
    {
      title: 'Storage Used',
      value: '847 GB',
      change: '+2.1 GB',
      trend: 'up',
      icon: '💾',
      color: 'purple',
    },
  ];

  // Generate mock chart data
  const userGrowthData: ChartData[] = [
    { label: 'Jan', value: 85, color: 'bg-blue-500' },
    { label: 'Feb', value: 92, color: 'bg-blue-500' },
    { label: 'Mar', value: 78, color: 'bg-blue-500' },
    { label: 'Apr', value: 95, color: 'bg-blue-500' },
    { label: 'May', value: 88, color: 'bg-blue-500' },
    { label: 'Jun', value: 100, color: 'bg-blue-500' },
  ];

  const systemHealthData: ChartData[] = [
    { label: 'CPU', value: 65, color: 'bg-green-500' },
    { label: 'Memory', value: 78, color: 'bg-yellow-500' },
    { label: 'Disk', value: 45, color: 'bg-blue-500' },
    { label: 'Network', value: 82, color: 'bg-purple-500' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      user: 'System',
      action: 'Database backup completed',
      time: '2 min ago',
      type: 'success',
    },
    {
      id: 2,
      user: 'Admin',
      action: 'New user registered: john.doe@example.com',
      time: '5 min ago',
      type: 'info',
    },
    {
      id: 3,
      user: 'System',
      action: 'Failed login attempt detected',
      time: '8 min ago',
      type: 'warning',
    },
    {
      id: 4,
      user: 'Moderator',
      action: 'Content moderation action taken',
      time: '12 min ago',
      type: 'info',
    },
    {
      id: 5,
      user: 'System',
      action: 'Cache cleared successfully',
      time: '15 min ago',
      type: 'success',
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>
          {entity.name} Dashboard
        </h3>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
            ⚙️ System Admin
          </span>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xl">{metric.icon}</span>
              <span
                className={`rounded-full px-2 py-1 text-xs bg-${metric.color}-100 text-${metric.color}-800`}
              >
                <span className={getTrendColor(metric.trend)}>{getTrendIcon(metric.trend)}</span>{' '}
                {metric.change}
              </span>
            </div>
            <div className="mb-1 text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-4 flex items-center text-base font-medium text-gray-900">
            📊 User Growth Trend
          </h4>
          <div className="flex h-32 items-end space-x-2">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div
                  className={`w-full ${data.color} rounded-t-sm transition-all hover:opacity-80`}
                  style={{ height: `${data.value}%` }}
                />
                <span className="mt-2 text-xs text-gray-600">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Chart */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-4 flex items-center text-base font-medium text-gray-900">
            🏥 System Health
          </h4>
          <div className="space-y-3">
            {systemHealthData.map((data, index) => (
              <div key={index} className="flex items-center">
                <span className="w-16 text-sm text-gray-600">{data.label}</span>
                <div className="mx-3 h-3 flex-1 rounded-full bg-gray-200">
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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="mb-4 flex items-center text-base font-medium text-gray-900">
          ⚡ Recent System Activity
        </h4>
        <div className="max-h-48 space-y-3 overflow-y-auto">
          {recentActivities.map(activity => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-white"
            >
              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}:</span> {activity.action}
                  </p>
                  <span className="ml-2 whitespace-nowrap text-xs text-gray-500">
                    {activity.time}
                  </span>
                </div>
                <span
                  className={`mt-1 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getActivityColor(activity.type)}`}
                >
                  {activity.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          🔄 Refresh Data
        </button>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          📊 Export Report
        </button>
        <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          ⚙️ System Settings
        </button>
        <button className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          🚨 Emergency Actions
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
