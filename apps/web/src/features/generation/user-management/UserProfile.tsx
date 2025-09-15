import React from 'react'
import type { Entity } from '@mini-ai-app-builder/shared-types'

interface UserProfileProps {
  entity: Entity
}

const UserProfile = ({ entity }: UserProfileProps): React.ReactElement => {
  // Extract user info from entity attributes for more realistic display
  const userName = entity.name
  const userRole = entity.attributes.find(attr =>
    attr.toLowerCase().includes('role') ||
    attr.toLowerCase().includes('admin') ||
    attr.toLowerCase().includes('manager')
  ) || 'User'

  // Generate avatar initials from name
  const getInitials = (name: string) => {
    const words = name.split(' ').filter(word => word.length > 0)
    if (words.length === 1) {
      // For single names, take first two characters
      return words[0].substring(0, 2).toUpperCase()
    }
    // For multiple names, take first letter of each word (up to 2)
    return words.map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  // Determine role color and icon
  const getRoleDisplay = (role: string) => {
    const roleLower = role.toLowerCase()
    if (roleLower.includes('admin')) {
      return { color: 'red', icon: '👑', label: 'Administrator' }
    } else if (roleLower.includes('manager') || roleLower.includes('mod')) {
      return { color: 'blue', icon: '🔧', label: 'Manager' }
    } else if (roleLower.includes('editor') || roleLower.includes('author')) {
      return { color: 'green', icon: '✏️', label: 'Editor' }
    } else {
      return { color: 'gray', icon: '👤', label: 'Member' }
    }
  }

  const roleDisplay = getRoleDisplay(userRole)
  const initials = getInitials(userName)

  // Mock activity status - in real app this would come from API
  const isOnline = Math.random() > 0.4 // 60% chance online
  const lastSeen = isOnline ? 'Online now' : `Last seen ${Math.floor(Math.random() * 60)} min ago`

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {initials}
          </div>
          {/* Online Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-400' : 'bg-gray-400'
          }`} />
        </div>

        {/* User Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {userName}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${roleDisplay.color}-100 text-${roleDisplay.color}-800 border border-${roleDisplay.color}-200`}>
              <span className="mr-1">{roleDisplay.icon}</span>
              {roleDisplay.label}
            </span>
          </div>

          {/* Activity Status */}
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-500">{lastSeen}</span>
          </div>

          {/* User Attributes */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Profile Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {entity.attributes.slice(0, 6).map((attribute, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-500 capitalize">{attribute}:</span>
                  <span className="ml-2 text-gray-900">Sample data</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              📝 Edit Profile
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              💬 Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile