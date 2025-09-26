import React from 'react';
import type { Entity } from '@mini-ai-app-builder/shared-types';

interface UserProfileProps {
  entity: Entity;
}

const UserProfile = ({ entity }: UserProfileProps): React.ReactElement => {
  // Extract user info from entity attributes for more realistic display
  const userName = entity.name;
  const userRole =
    entity.attributes.find(
      attr =>
        attr.toLowerCase().includes('role') ||
        attr.toLowerCase().includes('admin') ||
        attr.toLowerCase().includes('manager'),
    ) || 'User';

  // Generate avatar initials from name
  const getInitials = (name: string) => {
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      // For single names, take first two characters
      return words[0].substring(0, 2).toUpperCase();
    }
    // For multiple names, take first letter of each word (up to 2)
    return words
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine role color and icon
  const getRoleDisplay = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) {
      return {
        classes: 'bg-red-100 text-red-800 border-red-200',
        icon: '👑',
        label: 'Administrator',
      };
    } else if (roleLower.includes('manager') || roleLower.includes('mod')) {
      return {
        classes: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '🔧',
        label: 'Manager',
      };
    } else if (roleLower.includes('editor') || roleLower.includes('author')) {
      return {
        classes: 'bg-green-100 text-green-800 border-green-200',
        icon: '✏️',
        label: 'Editor',
      };
    } else {
      return {
        classes: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '👤',
        label: 'Member',
      };
    }
  };

  const roleDisplay = getRoleDisplay(userRole);
  const initials = getInitials(userName);

  // Mock activity status - in real app this would come from API
  const isOnline = Math.random() > 0.4; // 60% chance online
  const lastSeen = isOnline ? 'Online now' : `Last seen ${Math.floor(Math.random() * 60)} min ago`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start space-x-4">
        {/* Avatar Section */}
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-lg font-semibold text-white shadow-md">
            {initials}
          </div>
          {/* Online Status Indicator */}
          <div
            className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white ${
              isOnline ? 'bg-green-400' : 'bg-gray-400'
            }`}
          />
        </div>

        {/* User Info Section */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="truncate text-xl font-semibold text-gray-900">{userName}</h3>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${roleDisplay.classes}`}
            >
              <span className="mr-1">{roleDisplay.icon}</span>
              {roleDisplay.label}
            </span>
          </div>

          {/* Activity Status */}
          <div className="mt-2 flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-500">{lastSeen}</span>
          </div>

          {/* User Attributes */}
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Profile Details</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {entity.attributes.slice(0, 6).map((attribute, index) => (
                <div key={index} className="text-sm">
                  <span className="capitalize text-gray-500">{attribute}:</span>
                  <span className="ml-2 text-gray-900">Sample data</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              📝 Edit Profile
            </button>
            <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              💬 Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
