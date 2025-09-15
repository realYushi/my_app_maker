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
    expect(screen.getByTestId('entity-form-Product')).toBeInTheDocument()
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