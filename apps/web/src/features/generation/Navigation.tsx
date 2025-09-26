import { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon, CogIcon, EyeIcon } from '@heroicons/react/20/solid';
import type { UserRole, Feature } from '@mini-ai-app-builder/shared-types';

interface NavigationProps {
  userRoles: UserRole[];
  features: Feature[];
  onOverviewToggle?: () => void;
  showOverview?: boolean;
}

interface NavigationSection {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
  defaultOpen?: boolean;
}

interface NavigationItem {
  id: string;
  name: string;
  type: 'default' | 'role' | 'feature';
  description?: string;
}

const Navigation = memo(
  ({ userRoles, features, onOverviewToggle, showOverview }: NavigationProps) => {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const dropdownRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

    // Memoize organized navigation sections with better categorization
    const navigationSections = useMemo((): NavigationSection[] => {
      const sections: NavigationSection[] = [
        {
          id: 'overview',
          name: 'Overview',
          icon: EyeIcon,
          items: [{ id: 'overview', name: 'Overview', type: 'default' }],
          defaultOpen: true,
        },
      ];

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
            description: role.description,
          })),
          defaultOpen: false,
        });
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
            description: feature.description,
          })),
          defaultOpen: false,
        });
      }

      return sections;
    }, [userRoles, features]);

    // Track which sections are expanded (desktop only)
    const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
      return new Set(
        navigationSections.filter(section => section.defaultOpen).map(section => section.id),
      );
    });

    const handleTabClick = useCallback((tabId: string) => {
      setActiveTab(tabId);
    }, []);

    const handleOverviewClick = useCallback(() => {
      setActiveTab('overview');
      if (onOverviewToggle) {
        onOverviewToggle();
      }
    }, [onOverviewToggle]);

    const toggleSection = useCallback((sectionId: string) => {
      setExpandedSections(prev => {
        if (prev.has(sectionId)) {
          // If clicking on already expanded section, close it
          const newSet = new Set(prev);
          newSet.delete(sectionId);
          return newSet;
        } else {
          // If opening a new section, close all others and open only this one
          return new Set([sectionId]);
        }
      });
    }, []);

    const handleItemClick = useCallback((itemId: string, currentSectionId: string) => {
      setActiveTab(itemId);
      // Always keep the dropdown open when clicking items within it
      // The dropdown should stay open until user clicks outside or clicks a different section
      setExpandedSections(new Set([currentSectionId]));
    }, []);

    // Handle clicks outside dropdowns to close them
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        let clickedInsideAnyDropdown = false;

        dropdownRefs.current.forEach(ref => {
          if (ref && ref.contains(target)) {
            clickedInsideAnyDropdown = true;
          }
        });

        if (!clickedInsideAnyDropdown) {
          setExpandedSections(new Set());
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <Disclosure as="nav" className="border-b border-gray-200 bg-gray-50">
        {({ open }) => (
          <>
            <div className="px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                {/* Desktop Navigation with Collapsible Sections */}
                <div className="hidden lg:flex lg:flex-1 lg:gap-6">
                  {navigationSections.map(section => (
                    <div key={section.id} className="relative">
                      {/* Handle single-item sections that match section name directly */}
                      {section.items.length === 1 && section.items[0].name === section.name ? (
                        <button
                          onClick={() => {
                            if (section.id === 'overview' && onOverviewToggle) {
                              handleOverviewClick();
                            } else {
                              handleTabClick(section.items[0].id);
                            }
                          }}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            (section.id === 'overview' && showOverview) ||
                            (section.id !== 'overview' && activeTab === section.items[0].id)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <section.icon className="h-4 w-4" />
                          <span>{section.name}</span>
                        </button>
                      ) : (
                        <div
                          className="relative"
                          ref={el => dropdownRefs.current.set(section.id, el)}
                        >
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                            <div className="absolute left-0 top-full z-10 mt-1 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg">
                              <div className="py-1">
                                {section.items.map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      handleItemClick(item.id, section.id);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                                      activeTab === item.id
                                        ? 'border-l-2 border-blue-500 bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="truncate">{item.name}</span>
                                      {item.type === 'role' && (
                                        <span className="ml-2 inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                                          Role
                                        </span>
                                      )}
                                      {item.type === 'feature' && (
                                        <span className="ml-2 inline-flex items-center rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
                                          Feature
                                        </span>
                                      )}
                                    </div>
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
                <div className="hidden md:flex md:flex-1 md:gap-2 md:overflow-x-auto lg:hidden">
                  {navigationSections.map(section =>
                    section.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'overview' && onOverviewToggle) {
                            handleOverviewClick();
                          } else {
                            handleItemClick(item.id, section.id);
                          }
                        }}
                        className={`min-h-[44px] min-w-[44px] flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          (item.id === 'overview' && showOverview) ||
                          (item.id !== 'overview' && activeTab === item.id)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="truncate">{item.name}</span>
                        {item.type === 'role' && (
                          <span className="ml-1 inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
                            R
                          </span>
                        )}
                        {item.type === 'feature' && (
                          <span className="ml-1 inline-flex items-center rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
                            F
                          </span>
                        )}
                      </button>
                    )),
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <Disclosure.Button className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>

              {/* Active Tab Info - Desktop & Tablet - Only show description when item is selected, not in dropdown */}
              <div className="mt-3 hidden md:block">
                {activeTab !== 'overview' && (
                  <div className="rounded-md bg-gray-100 p-3 text-sm text-gray-600">
                    {navigationSections.map(section =>
                      section.items.map(item => {
                        if (item.id === activeTab && item.description) {
                          return (
                            <div key={item.id} className="flex items-start gap-2">
                              <span className="font-medium text-gray-900">{item.name}:</span>
                              <span className="flex-1">{item.description}</span>
                            </div>
                          );
                        }
                        return null;
                      }),
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation with Collapsible Sections */}
            <Disclosure.Panel className="border-t border-gray-200 bg-white md:hidden">
              <div className="max-h-[60vh] space-y-2 overflow-y-auto px-4 py-3">
                {navigationSections.map(section => (
                  <Disclosure key={section.id} as="div" defaultOpen={section.defaultOpen}>
                    {({ open: sectionOpen }) => (
                      <>
                        <Disclosure.Button className="flex min-h-[44px] w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
                        <Disclosure.Panel className="space-y-1 pl-6">
                          {section.items.map(item => (
                            <Disclosure.Button
                              key={item.id}
                              as="button"
                              onClick={() => {
                                if (item.id === 'overview' && onOverviewToggle) {
                                  handleOverviewClick();
                                } else {
                                  handleItemClick(item.id, section.id);
                                }
                              }}
                              className={`block min-h-[44px] w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                (item.id === 'overview' && showOverview) ||
                                (item.id !== 'overview' && activeTab === item.id)
                                  ? 'border-l-2 border-blue-500 bg-blue-100 text-blue-700'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="truncate">{item.name}</span>
                                {item.type === 'role' && (
                                  <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                    Role
                                  </span>
                                )}
                                {item.type === 'feature' && (
                                  <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                                    Feature
                                  </span>
                                )}
                              </div>
                              {activeTab === item.id && item.description && (
                                <div className="mt-1 text-xs leading-relaxed text-gray-500">
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
    );
  },
);

Navigation.displayName = 'Navigation';

export default Navigation;
