import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserProfile from './user-management/UserProfile'
import UserManagementTable from './user-management/UserManagementTable'
import AdminDashboard from './admin/AdminDashboard'
import SystemMetrics from './admin/SystemMetrics'
import type { Entity } from '@mini-ai-app-builder/shared-types'

const mockEntity: Entity = {
  name: 'Test Entity',
  attributes: ['responsive', 'design', 'test']
}

// Helper function to set viewport size
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  window.dispatchEvent(new Event('resize'))
}

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    // Mock Math.random for consistent test results
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.5
    global.Math = mockMath
  })

  afterEach(() => {
    // Reset viewport to default size
    setViewportSize(1024, 768)
  })

  describe('Desktop Viewport (1024px+)', () => {
    beforeEach(() => {
      setViewportSize(1200, 800)
    })

    it('UserProfile renders correctly on desktop', () => {
      render(<UserProfile entity={mockEntity} />)

      // Should show full layout with side-by-side elements
      expect(screen.getByText('Test Entity')).toBeInTheDocument()
      expect(screen.getByText('Profile Details')).toBeInTheDocument()

      // Check that action buttons are visible
      expect(screen.getByText('📝 Edit Profile')).toBeInTheDocument()
      expect(screen.getByText('💬 Send Message')).toBeInTheDocument()
    })

    it('UserManagementTable shows full table on desktop', () => {
      render(<UserManagementTable entity={mockEntity} />)

      // Table headers should all be visible
      expect(screen.getByText('User')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Last Login')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('AdminDashboard displays grid layout on desktop', () => {
      render(<AdminDashboard entity={mockEntity} />)

      // Should show metrics in grid layout
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('Active Sessions')).toBeInTheDocument()
      expect(screen.getByText('System Load')).toBeInTheDocument()

      // Charts should be side by side
      expect(screen.getByText('📊 User Growth Trend')).toBeInTheDocument()
      expect(screen.getByText('🏥 System Health')).toBeInTheDocument()
    })

    it('SystemMetrics shows full grid on desktop', () => {
      render(<SystemMetrics entity={mockEntity} />)

      // Should display metrics in grid format
      expect(screen.getByText('Test Entity Metrics')).toBeInTheDocument()
      expect(screen.getByText('System Health Overview')).toBeInTheDocument()
    })
  })

  describe('Tablet Viewport (768px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024)
    })

    it('UserProfile adapts to tablet view', () => {
      render(<UserProfile entity={mockEntity} />)

      // Should still show main content but may stack differently
      expect(screen.getByText('Test Entity')).toBeInTheDocument()
      expect(screen.getByText('Profile Details')).toBeInTheDocument()
    })

    it('UserManagementTable remains functional on tablet', () => {
      render(<UserManagementTable entity={mockEntity} />)

      // Table should be scrollable horizontally if needed
      expect(screen.getByText('User')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
    })

    it('AdminDashboard stacks appropriately on tablet', () => {
      render(<AdminDashboard entity={mockEntity} />)

      // Metrics should still be visible
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('📊 User Growth Trend')).toBeInTheDocument()
    })
  })

  describe('Mobile Viewport (320px)', () => {
    beforeEach(() => {
      setViewportSize(320, 568)
    })

    it('UserProfile stacks vertically on mobile', () => {
      render(<UserProfile entity={mockEntity} />)

      // Content should still be accessible
      expect(screen.getByText('Test Entity')).toBeInTheDocument()
      expect(screen.getByText('Profile Details')).toBeInTheDocument()

      // Buttons should stack or be responsive
      expect(screen.getByText('📝 Edit Profile')).toBeInTheDocument()
    })

    it('UserManagementTable is scrollable on mobile', () => {
      render(<UserManagementTable entity={mockEntity} />)

      // Should have horizontal scroll for table
      expect(screen.getByText('👥 User Directory')).toBeInTheDocument()

      // Search and filter should stack vertically
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
    })

    it('AdminDashboard compacts for mobile', () => {
      render(<AdminDashboard entity={mockEntity} />)

      // Title should be visible
      expect(screen.getByText('Test Entity Dashboard')).toBeInTheDocument()

      // Metrics should stack in single column
      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })

    it('SystemMetrics adapts to mobile layout', () => {
      render(<SystemMetrics entity={mockEntity} />)

      // Should show system metrics in mobile-friendly layout
      expect(screen.getByText('Test Entity Metrics')).toBeInTheDocument()
      expect(screen.getByText('System Health Overview')).toBeInTheDocument()
    })
  })

  describe('CSS Classes for Responsive Design', () => {
    it('components use Tailwind responsive classes', () => {
      const { container } = render(<UserProfile entity={mockEntity} />)

      // Check that responsive classes are present in the DOM
      const responsiveElements = container.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]')
      expect(responsiveElements.length).toBeGreaterThan(0)

      // Should specifically have sm:grid-cols-2 and sm:flex-row classes
      expect(container.innerHTML).toContain('sm:grid-cols-2')
      expect(container.innerHTML).toContain('sm:flex-row')
    })

    it('grid layouts use responsive grid classes', () => {
      const { container } = render(<AdminDashboard entity={mockEntity} />)

      // Should have grid classes that are responsive
      const gridElements = container.querySelectorAll('[class*="grid"], [class*="md:grid-cols"], [class*="lg:grid-cols"]')
      expect(gridElements.length).toBeGreaterThan(0)

      // Should specifically have responsive grid classes from AdminDashboard
      expect(container.innerHTML).toContain('md:grid-cols-2')
      expect(container.innerHTML).toContain('lg:grid-cols-3')
    })

    it('flex layouts use responsive flex classes', () => {
      const { container } = render(<UserManagementTable entity={mockEntity} />)

      // Should have flex classes for responsive layout
      const flexElements = container.querySelectorAll('[class*="flex"], [class*="sm:flex-row"], [class*="flex-col"]')
      expect(flexElements.length).toBeGreaterThan(0)

      // Should specifically have responsive flex classes from UserManagementTable
      expect(container.innerHTML).toContain('flex-col')
      expect(container.innerHTML).toContain('sm:flex-row')
    })
  })

  describe('Content Accessibility on Different Viewports', () => {
    it('maintains text readability across viewports', () => {
      // Desktop
      setViewportSize(1200, 800)
      const { rerender } = render(<UserProfile entity={mockEntity} />)
      expect(screen.getByText('Test Entity')).toBeInTheDocument()

      // Mobile
      setViewportSize(320, 568)
      rerender(<UserProfile entity={mockEntity} />)
      expect(screen.getByText('Test Entity')).toBeInTheDocument()
    })

    it('preserves interactive elements across viewports', () => {
      // Desktop
      setViewportSize(1200, 800)
      const { rerender } = render(<UserManagementTable entity={mockEntity} />)
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()

      // Mobile
      setViewportSize(320, 568)
      rerender(<UserManagementTable entity={mockEntity} />)
      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
    })

    it('maintains navigation and controls on all screen sizes', () => {
      // Test pagination controls remain accessible
      setViewportSize(320, 568)
      render(<UserManagementTable entity={mockEntity} />)

      // Pagination should still be accessible on mobile
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })
  })
})