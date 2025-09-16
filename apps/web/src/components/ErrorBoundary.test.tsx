import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'
import { GenerationErrorBoundary, EntityFormErrorBoundary } from './ErrorBoundaryVariants'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  test('renders default error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
    expect(screen.getByText('Reload page')).toBeInTheDocument()
  })

  test('renders custom fallback UI when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  test('calls onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })
})

describe('GenerationErrorBoundary', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  test('renders children when there is no error', () => {
    render(
      <GenerationErrorBoundary>
        <ThrowError shouldThrow={false} />
      </GenerationErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  test('renders generation-specific error UI when there is an error', () => {
    render(
      <GenerationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </GenerationErrorBoundary>
    )

    expect(screen.getByText('Generation Component Error')).toBeInTheDocument()
    expect(screen.getByText(/There was an issue displaying the generated app content/)).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
  })
})

describe('EntityFormErrorBoundary', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  test('renders children when there is no error', () => {
    render(
      <EntityFormErrorBoundary>
        <ThrowError shouldThrow={false} />
      </EntityFormErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  test('renders entity form-specific error UI when there is an error', () => {
    render(
      <EntityFormErrorBoundary>
        <ThrowError shouldThrow={true} />
      </EntityFormErrorBoundary>
    )

    expect(screen.getByText('Unable to display this form component')).toBeInTheDocument()
  })
})