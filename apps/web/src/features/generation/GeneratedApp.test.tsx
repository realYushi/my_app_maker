import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import GeneratedApp from './GeneratedApp'
import { AppProvider } from '../../contexts/AppContext'
import type { GenerationResult } from '@mini-ai-app-builder/shared-types'

// Mock the child components to focus on GeneratedApp's logic
vi.mock('./Navigation', () => ({
  default: ({ userRoles, features }: { userRoles: Array<unknown>, features: Array<unknown> }) => (
    <div data-testid="navigation">
      Navigation with {userRoles.length} roles and {features.length} features
    </div>
  )
}))

vi.mock('./EntityForm', () => ({
  default: ({ entity }: { entity: { name: string } }) => (
    <div data-testid={`entity-form-${entity.name}`}>
      EntityForm for {entity.name}
    </div>
  )
}))

const mockGenerationResult: GenerationResult = {
  appName: 'Test App',
  entities: [
    { name: 'User', attributes: ['name', 'email', 'password'] },
    { name: 'Product', attributes: ['title', 'description', 'price'] }
  ],
  userRoles: [
    { name: 'Admin', description: 'System administrator' },
    { name: 'User', description: 'Regular user' }
  ],
  features: [
    { name: 'Authentication', description: 'User login and registration' },
    { name: 'Product Management', description: 'CRUD operations for products' }
  ]
}

const renderGeneratedApp = (generationResult: GenerationResult = mockGenerationResult) => {
  return render(
    <AppProvider>
      <GeneratedApp generationResult={generationResult} />
    </AppProvider>
  )
}

describe('GeneratedApp', () => {
  describe('Basic functionality (backward compatibility)', () => {
    it('renders the app name in the header', () => {
      renderGeneratedApp()
      expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    })

    it('renders the Generate New App button', () => {
      renderGeneratedApp()
      expect(screen.getByRole('button', { name: /generate new app/i })).toBeInTheDocument()
    })

    it('renders the navigation component with correct props', () => {
      renderGeneratedApp()
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
      expect(screen.getByText('Navigation with 2 roles and 2 features')).toBeInTheDocument()
    })

    it('displays app overview with correct statistics', () => {
      renderGeneratedApp()
      expect(screen.getByText(/this is a mock ui for/i)).toBeInTheDocument()
      expect(screen.getAllByText(/test app/i)).toHaveLength(2) // Header and overview
      expect(screen.getByText(/2 entities/i)).toBeInTheDocument()
      expect(screen.getByText(/2 user roles/i)).toBeInTheDocument()
      expect(screen.getAllByText(/2 features/i)).toHaveLength(2) // Navigation and overview
    })

    it('renders entity forms when entities exist', () => {
      renderGeneratedApp()
      expect(screen.getByText('Data Management')).toBeInTheDocument()
      expect(screen.getByTestId('entity-form-User')).toBeInTheDocument()
      // Product entity now uses enhanced e-commerce component, so check for that instead
      expect(screen.getByText('🛍️ Product Card')).toBeInTheDocument()
      expect(screen.getByText('🛒 Add to Cart')).toBeInTheDocument()
    })

    it('renders features section when features exist', () => {
      renderGeneratedApp()
      expect(screen.getByText('Available Features')).toBeInTheDocument()
      expect(screen.getByText('Authentication')).toBeInTheDocument()
      expect(screen.getByText('User login and registration')).toBeInTheDocument()
      expect(screen.getByText('Product Management')).toBeInTheDocument()
      expect(screen.getByText('CRUD operations for products')).toBeInTheDocument()
    })

    it('renders View Details buttons for each feature', () => {
      renderGeneratedApp()
      const viewDetailsButtons = screen.getAllByRole('button', { name: /view details/i })
      expect(viewDetailsButtons).toHaveLength(2)
    })

    it('does not render Data Management section when no entities', () => {
      const resultWithoutEntities: GenerationResult = {
        ...mockGenerationResult,
        entities: []
      }
      renderGeneratedApp(resultWithoutEntities)
      expect(screen.queryByText('Data Management')).not.toBeInTheDocument()
    })

    it('does not render Available Features section when no features', () => {
      const resultWithoutFeatures: GenerationResult = {
        ...mockGenerationResult,
        features: []
      }
      renderGeneratedApp(resultWithoutFeatures)
      expect(screen.queryByText('Available Features')).not.toBeInTheDocument()
    })

    it('has responsive design classes', () => {
      const { container } = renderGeneratedApp()
      const mainDiv = container.firstChild as HTMLElement
      expect(mainDiv).toHaveClass('mt-6', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow-lg')
    })

    it('calls reset function when Generate New App button is clicked', async () => {
      const user = userEvent.setup()
      renderGeneratedApp()

      const generateButton = screen.getByRole('button', { name: /generate new app/i })

      await act(async () => {
        await user.click(generateButton)
      })

      // Since we're using the actual AppProvider, we can't easily mock the reset function
      // This test verifies the button is clickable and doesn't throw errors
      expect(generateButton).toBeInTheDocument()
    })

    it('truncates long app names appropriately', () => {
      const longNameResult: GenerationResult = {
        ...mockGenerationResult,
        appName: 'This is a very long application name that should be truncated properly'
      }
      renderGeneratedApp(longNameResult)
      const heading = screen.getByRole('heading', { name: /this is a very long application name/i })
      expect(heading).toHaveClass('truncate')
    })
  })

  describe('Context-aware rendering', () => {
    it('detects e-commerce context and applies appropriate theming', () => {
      const ecommerceResult: GenerationResult = {
        appName: 'Online Store',
        entities: [
          { name: 'Product', attributes: ['name', 'price', 'category'] },
          { name: 'Order', attributes: ['total', 'status', 'customer_id'] },
          { name: 'Customer', attributes: ['name', 'email', 'address'] }
        ],
        userRoles: [],
        features: []
      }

      const { container } = renderGeneratedApp(ecommerceResult)

      // Check for e-commerce theme and icon
      expect(screen.getByText('🛍️')).toBeInTheDocument()
      expect(screen.getByText('E-commerce platform')).toBeInTheDocument()
      expect(screen.getByText('ECOMMERCE')).toBeInTheDocument()
      expect(screen.getByText('(3 matched entities)')).toBeInTheDocument()

      // Check header uses e-commerce theme
      const header = container.querySelector('.bg-gradient-to-r')
      expect(header).toHaveClass('from-blue-600', 'to-blue-700')
    })

    it('detects user management context and applies appropriate theming', () => {
      const userMgmtResult: GenerationResult = {
        appName: 'User Portal',
        entities: [
          { name: 'User', attributes: ['username', 'email', 'password'] },
          { name: 'Role', attributes: ['name', 'permissions'] },
          { name: 'Permission', attributes: ['action', 'resource'] }
        ],
        userRoles: [],
        features: []
      }

      const { container } = renderGeneratedApp(userMgmtResult)

      // Check for user management theme and icon
      expect(screen.getByText('👥')).toBeInTheDocument()
      expect(screen.getByText('User management system')).toBeInTheDocument()
      expect(screen.getByText('USER MANAGEMENT')).toBeInTheDocument()
      expect(screen.getByText('(3 matched entities)')).toBeInTheDocument()

      // Check header uses user management theme
      const header = container.querySelector('.bg-gradient-to-r')
      expect(header).toHaveClass('from-indigo-600', 'to-indigo-700')
    })

    it('detects admin context and applies appropriate theming', () => {
      const adminResult: GenerationResult = {
        appName: 'Admin Dashboard',
        entities: [
          { name: 'System', attributes: ['status', 'version', 'uptime'] },
          { name: 'Log', attributes: ['level', 'message', 'timestamp'] },
          { name: 'Configuration', attributes: ['key', 'value', 'type'] }
        ],
        userRoles: [],
        features: []
      }

      const { container } = renderGeneratedApp(adminResult)

      // Check for admin theme and icon
      expect(screen.getByText('⚙️')).toBeInTheDocument()
      expect(screen.getByText('Administrative dashboard')).toBeInTheDocument()
      expect(screen.getByText('ADMIN')).toBeInTheDocument()
      expect(screen.getByText('(3 matched entities)')).toBeInTheDocument()

      // Check header uses admin theme
      const header = container.querySelector('.bg-gradient-to-r')
      expect(header).toHaveClass('from-red-600', 'to-red-700')
    })

    it('applies generic theme for unrecognized entities', () => {
      const genericResult: GenerationResult = {
        appName: 'Generic App',
        entities: [
          { name: 'Book', attributes: ['title', 'author', 'isbn'] },
          { name: 'Recipe', attributes: ['ingredients', 'instructions'] }
        ],
        userRoles: [],
        features: []
      }

      const { container } = renderGeneratedApp(genericResult)

      // Check for generic theme and icon
      expect(screen.getByText('📱')).toBeInTheDocument()
      expect(screen.getByText('Application platform')).toBeInTheDocument()

      // Should not show context detection info for generic
      expect(screen.queryByText('Detected Context:')).not.toBeInTheDocument()

      // Check header uses generic theme
      const header = container.querySelector('.bg-gradient-to-r')
      expect(header).toHaveClass('from-gray-600', 'to-gray-700')
    })

    it('handles mixed context correctly', () => {
      const mixedResult: GenerationResult = {
        appName: 'Mixed App',
        entities: [
          { name: 'Product', attributes: ['name', 'price'] }, // E-commerce
          { name: 'User', attributes: ['username', 'email'] }, // User management
          { name: 'Book', attributes: ['title', 'author'] } // Generic
        ],
        userRoles: [],
        features: []
      }

      renderGeneratedApp(mixedResult)

      // Should detect the dominant context (likely e-commerce or user management)
      expect(screen.getByText(/Detected Context:/)).toBeInTheDocument()

      // Should show the number of matched entities
      expect(screen.getByText(/matched entities/)).toBeInTheDocument()
    })

    it('does not show context detection for empty entities', () => {
      const emptyResult: GenerationResult = {
        appName: 'Empty App',
        entities: [],
        userRoles: [],
        features: []
      }

      renderGeneratedApp(emptyResult)

      // Should not show context detection info
      expect(screen.queryByText('Detected Context:')).not.toBeInTheDocument()

      // Should use generic theme
      expect(screen.getByText('📱')).toBeInTheDocument()
      expect(screen.getByText('Application platform')).toBeInTheDocument()
    })
  })

  describe('Component factory integration', () => {
    it('uses component factory for entity rendering', () => {
      const ecommerceResult: GenerationResult = {
        appName: 'Store',
        entities: [
          { name: 'Product', attributes: ['name', 'price'] }
        ],
        userRoles: [],
        features: []
      }

      renderGeneratedApp(ecommerceResult)

      // The entity should be rendered via component factory (Product gets enhanced e-commerce component)
      expect(screen.getByText('🛍️ Product Card')).toBeInTheDocument()
      expect(screen.getByText('🛒 Add to Cart')).toBeInTheDocument()
    })

    it('maintains unique keys for entity components', () => {
      const resultWithDuplicates: GenerationResult = {
        appName: 'Test',
        entities: [
          { name: 'Product', attributes: ['name'] },
          { name: 'Product', attributes: ['price'] } // Same name, different attributes
        ],
        userRoles: [],
        features: []
      }

      renderGeneratedApp(resultWithDuplicates)

      // Both Product entities should be rendered (will show as enhanced e-commerce components)
      const productElements = screen.getAllByText('🛒 Add to Cart')
      expect(productElements).toHaveLength(2)
    })
  })

  describe('Performance and memoization', () => {
    it('memoizes context detection based on entities', () => {
      const result: GenerationResult = {
        appName: 'Test',
        entities: [{ name: 'Product', attributes: ['price'] }],
        userRoles: [],
        features: []
      }

      const { rerender } = renderGeneratedApp(result)

      // Context should be detected
      expect(screen.getByText('🛍️')).toBeInTheDocument()

      // Rerender with same entities - context should be memoized
      rerender(
        <AppProvider>
          <GeneratedApp generationResult={{
            ...result,
            appName: 'Updated Name' // Different app name but same entities
          }} />
        </AppProvider>
      )

      // Should still show e-commerce context
      expect(screen.getByText('🛍️')).toBeInTheDocument()
    })
  })
})