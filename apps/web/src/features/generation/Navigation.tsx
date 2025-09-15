import { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import type { UserRole, Feature } from '@mini-ai-app-builder/shared-types'

interface NavigationProps {
  userRoles: UserRole[]
  features: Feature[]
}

const Navigation = ({ userRoles, features }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview')

  // Combine navigation items from roles and features
  const navigationItems = [
    { id: 'overview', name: 'Overview', type: 'default' },
    ...userRoles.map(role => ({ id: `role-${role.name}`, name: role.name, type: 'role' as const })),
    ...features.map(feature => ({ id: `feature-${feature.name}`, name: feature.name, type: 'feature' as const }))
  ]

  return (
    <Disclosure as="nav" className="bg-gray-50 border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Desktop Navigation */}
              <div className="hidden md:flex md:space-x-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                    {item.type === 'role' && (
                      <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Role
                      </span>
                    )}
                    {item.type === 'feature' && (
                      <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Feature
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>

            {/* Active Tab Info */}
            <div className="mt-2 hidden md:block">
              {activeTab !== 'overview' && (
                <div className="text-sm text-gray-600">
                  {activeTab.startsWith('role-') && (
                    <span>
                      Role: {userRoles.find(role => `role-${role.name}` === activeTab)?.description}
                    </span>
                  )}
                  {activeTab.startsWith('feature-') && (
                    <span>
                      Feature: {features.find(feature => `feature-${feature.name}` === activeTab)?.description}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigationItems.map((item) => (
                <Disclosure.Button
                  key={item.id}
                  as="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.type === 'role' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Role
                      </span>
                    )}
                    {item.type === 'feature' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Feature
                      </span>
                    )}
                  </div>
                  {activeTab === item.id && item.id !== 'overview' && (
                    <div className="mt-1 text-xs text-gray-500">
                      {item.id.startsWith('role-') &&
                        userRoles.find(role => `role-${role.name}` === item.id)?.description}
                      {item.id.startsWith('feature-') &&
                        features.find(feature => `feature-${feature.name}` === item.id)?.description}
                    </div>
                  )}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navigation