import { useState, memo, useMemo, useCallback } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { UserGroupIcon, CogIcon, EyeIcon } from '@heroicons/react/20/solid'
import type { UserRole, Feature } from '@mini-ai-app-builder/shared-types'

interface NavigationProps {
  userRoles: UserRole[]
  features: Feature[]
}

interface NavigationSection {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  items: NavigationItem[]
  defaultOpen?: boolean
}

interface NavigationItem {
  id: string
  name: string
  type: 'default' | 'role' | 'feature'
  description?: string
}

const Navigation = memo(({ userRoles, features }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview')

  // Memoize organized navigation sections with better categorization
  const navigationSections = useMemo((): NavigationSection[] => {
    const sections: NavigationSection[] = [
      {
        id: 'overview',
        name: 'Overview',
        icon: EyeIcon,
        items: [{ id: 'overview', name: 'Overview', type: 'default' }],
        defaultOpen: true
      }
    ]

    // Add User Roles section if roles exist
    if (userRoles.length > 0) {
      sections.push({
        id: 'roles',
        name: 'User Roles',
        icon: UserGroupIcon,
        items: userRoles.map(role => ({
          id: `role-${role.name}`,
          name: role.name,
          type: 'role' as const,
          description: role.description
        })),
        defaultOpen: false
      })
    }

    // Add Features section if features exist
    if (features.length > 0) {
      sections.push({
        id: 'features',
        name: 'Features',
        icon: CogIcon,
        items: features.map(feature => ({
          id: `feature-${feature.name}`,
          name: feature.name,
          type: 'feature' as const,
          description: feature.description
        })),
        defaultOpen: false
      })
    }

    return sections
  }, [userRoles, features])

  // Track which sections are expanded (desktop only)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    return new Set(navigationSections.filter(section => section.defaultOpen).map(section => section.id))
  })

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId)
  }, [])

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      if (prev.has(sectionId)) {
        // If clicking on already expanded section, close it
        const newSet = new Set(prev)
        newSet.delete(sectionId)
        return newSet
      } else {
        // If opening a new section, close all others and open only this one
        return new Set([sectionId])
      }
    })
  }, [])

  return (
    <Disclosure as="nav" className="bg-gray-50 border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Desktop Navigation with Collapsible Sections */}
              <div className="hidden lg:flex lg:flex-1 lg:gap-6">
                {navigationSections.map((section) => (
                  <div key={section.id} className="relative">
                    {/* Handle single-item sections that match section name directly */}
                    {section.items.length === 1 && section.items[0].name === section.name ? (
                      <button
                        onClick={() => handleTabClick(section.items[0].id)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          activeTab === section.items[0].id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <section.icon className="h-4 w-4" />
                        <span>{section.name}</span>
                      </button>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <section.icon className="h-4 w-4" />
                          <span>{section.name}</span>
                          {section.items.length > 1 && (
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-200 ${
                                expandedSections.has(section.id) ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>
                        {expandedSections.has(section.id) && (
                          <div className="absolute top-full left-0 z-10 mt-1 min-w-[200px] bg-white rounded-md shadow-lg border border-gray-200">
                            <div className="py-1">
                              {section.items.map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => handleTabClick(item.id)}
                                  className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                                    activeTab === item.id
                                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="truncate">{item.name}</span>
                                    {item.type === 'role' && (
                                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                        Role
                                      </span>
                                    )}
                                    {item.type === 'feature' && (
                                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                                        Feature
                                      </span>
                                    )}
                                  </div>
                                  {item.description && activeTab === item.id && (
                                    <div className="mt-1 text-xs text-gray-500 truncate">
                                      {item.description}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tablet Navigation - Simplified Horizontal */}
              <div className="hidden md:flex lg:hidden md:flex-1 md:gap-2 md:overflow-x-auto">
                {navigationSections.map((section) => (
                  section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      {item.type === 'role' && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          R
                        </span>
                      )}
                      {item.type === 'feature' && (
                        <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          F
                        </span>
                      )}
                    </button>
                  ))
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 min-h-[44px] min-w-[44px]">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>

            {/* Active Tab Info - Desktop & Tablet */}
            <div className="mt-3 hidden md:block">
              {activeTab !== 'overview' && (
                <div className="text-sm text-gray-600 bg-gray-100 rounded-md p-3">
                  {navigationSections.map(section =>
                    section.items.map(item => {
                      if (item.id === activeTab && item.description) {
                        return (
                          <div key={item.id} className="flex items-start gap-2">
                            <span className="font-medium text-gray-900">{item.name}:</span>
                            <span className="flex-1">{item.description}</span>
                          </div>
                        )
                      }
                      return null
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation with Collapsible Sections */}
          <Disclosure.Panel className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-2 max-h-[60vh] overflow-y-auto">
              {navigationSections.map((section) => (
                <Disclosure key={section.id} as="div" defaultOpen={section.defaultOpen}>
                  {({ open: sectionOpen }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <div className="flex items-center gap-2">
                          <section.icon className="h-4 w-4" />
                          <span>{section.name}</span>
                        </div>
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform duration-200 ${
                            sectionOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="pl-6 space-y-1">
                        {section.items.map((item) => (
                          <Disclosure.Button
                            key={item.id}
                            as="button"
                            onClick={() => handleTabClick(item.id)}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              activeTab === item.id
                                ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.name}</span>
                              {item.type === 'role' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                                  Role
                                </span>
                              )}
                              {item.type === 'feature' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                                  Feature
                                </span>
                              )}
                            </div>
                            {activeTab === item.id && item.description && (
                              <div className="mt-1 text-xs text-gray-500 leading-relaxed">
                                {item.description}
                              </div>
                            )}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation