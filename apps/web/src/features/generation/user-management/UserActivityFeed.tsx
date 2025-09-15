import React, { useState } from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface UserActivityFeedProps {
  entity: Entity
}

interface ActivityItem {
  id: number
  user: string
  action: string
  target: string
  timestamp: string
  type: 'create' | 'edit' | 'delete' | 'login' | 'system'
  description: string
}

const UserActivityFeed = ({ entity }: UserActivityFeedProps): React.ReactElement => {
  const [filter, setFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  // Generate mock activity data
  const generateMockActivities = (): ActivityItem[] => {
    const users = ['Alex Johnson', 'Sarah Chen', 'Mike Davis', 'Emily Rodriguez', 'Chris Wilson']
    const actions = [
      { type: 'create' as const, action: 'created', targets: ['new user account', 'blog post', 'project', 'document'] },
      { type: 'edit' as const, action: 'updated', targets: ['user profile', 'system settings', 'content', 'permissions'] },
      { type: 'delete' as const, action: 'deleted', targets: ['old file', 'user account', 'expired content', 'backup'] },
      { type: 'login' as const, action: 'logged in', targets: ['to the system', 'from mobile app', 'from web portal'] },
      { type: 'system' as const, action: 'system event', targets: ['backup completed', 'maintenance started', 'update installed'] }
    ]

    return Array.from({ length: 20 }, (_, i) => {
      const actionType = actions[Math.floor(Math.random() * actions.length)]
      const target = actionType.targets[Math.floor(Math.random() * actionType.targets.length)]
      const hoursAgo = Math.floor(Math.random() * 72)

      return {
        id: i + 1,
        user: users[Math.floor(Math.random() * users.length)],
        action: actionType.action,
        target,
        timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        type: actionType.type,
        description: `${actionType.action} ${target}`
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const activities = generateMockActivities()

  // Filter activities based on selected criteria
  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false

    const activityTime = new Date(activity.timestamp)
    const now = new Date()
    const timeDiff = now.getTime() - activityTime.getTime()

    switch (timeRange) {
      case '1h':
        return timeDiff <= 60 * 60 * 1000
      case '24h':
        return timeDiff <= 24 * 60 * 60 * 1000
      case '7d':
        return timeDiff <= 7 * 24 * 60 * 60 * 1000
      default:
        return true
    }
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return { icon: '➕', color: 'text-green-600 bg-green-100' }
      case 'edit': return { icon: '✏️', color: 'text-blue-600 bg-blue-100' }
      case 'delete': return { icon: '🗑️', color: 'text-red-600 bg-red-100' }
      case 'login': return { icon: '🔐', color: 'text-purple-600 bg-purple-100' }
      case 'system': return { icon: '⚙️', color: 'text-gray-600 bg-gray-100' }
      default: return { icon: '📝', color: 'text-gray-600 bg-gray-100' }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getActivityStats = () => {
    const stats = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { label: 'Created', count: stats.create || 0, color: 'text-green-600' },
      { label: 'Updated', count: stats.edit || 0, color: 'text-blue-600' },
      { label: 'Deleted', count: stats.delete || 0, color: 'text-red-600' },
      { label: 'Logins', count: stats.login || 0, color: 'text-purple-600' },
      { label: 'System', count: stats.system || 0, color: 'text-gray-600' }
    ]
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
          {entity.name} Activity Feed
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
          📊 Activity Monitoring
        </span>
      </div>

      {/* Activity Stats */}
      <div className="mb-6 grid grid-cols-5 gap-4">
        {getActivityStats().map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Controls */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Activities</option>
            <option value="create">Created</option>
            <option value="edit">Updated</option>
            <option value="delete">Deleted</option>
            <option value="login">Logins</option>
            <option value="system">System Events</option>
          </select>
        </div>
        <div className="sm:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <div>No activities found for the selected filters</div>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const iconConfig = getActivityIcon(activity.type)
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconConfig.color}`}>
                  <span className="text-sm">{iconConfig.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      <span className="font-normal">{activity.description}</span>
                    </p>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      activity.type === 'create' ? 'bg-green-100 text-green-800' :
                      activity.type === 'edit' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'delete' ? 'bg-red-100 text-red-800' :
                      activity.type === 'login' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Load More Button */}
      {filteredActivities.length > 0 && (
        <div className="mt-4 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Load More Activities
          </button>
        </div>
      )}
    </div>
  )
}

export default UserActivityFeed