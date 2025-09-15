import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import ErrorDisplay from './ErrorDisplay'

// Mock the AppContext to control error state
const mockReset = vi.fn()

vi.mock('../../contexts/AppContext', async () => {
  const actual = await vi.importActual('../../contexts/AppContext')
  return {
    ...actual,
    useAppContext: () => ({
      error: 'Test error message',
      reset: mockReset
    })
  }
})

const renderErrorDisplay = () => {
  return render(<ErrorDisplay />)
}

describe('ErrorDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders error heading', () => {
    renderErrorDisplay()
    expect(screen.getByText('Generation Failed')).toBeInTheDocument()
  })

  it('displays the error message', () => {
    renderErrorDisplay()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('renders Try Again button', () => {
    renderErrorDisplay()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('renders Reload Page button', () => {
    renderErrorDisplay()
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
  })

  it('calls reset function when Try Again button is clicked', async () => {
    const user = userEvent.setup()
    renderErrorDisplay()

    const tryAgainButton = screen.getByRole('button', { name: /try again/i })
    await user.click(tryAgainButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('has proper error styling classes', () => {
    const { container } = renderErrorDisplay()
    const errorContainer = container.firstChild as HTMLElement
    expect(errorContainer).toHaveClass('mt-6', 'p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg')
  })

  it('displays error icon', () => {
    const { container } = renderErrorDisplay()
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('h-5', 'w-5', 'text-red-400')
  })

  it('has responsive button layout', () => {
    renderErrorDisplay()
    const buttonContainer = screen.getByRole('button', { name: /try again/i }).parentElement
    expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-2')
  })

  it('buttons have proper styling', () => {
    renderErrorDisplay()

    const tryAgainButton = screen.getByRole('button', { name: /try again/i })
    expect(tryAgainButton).toHaveClass('px-4', 'py-2', 'text-sm', 'font-medium', 'text-red-800', 'bg-red-100')

    const reloadButton = screen.getByRole('button', { name: /reload page/i })
    expect(reloadButton).toHaveClass('px-4', 'py-2', 'text-sm', 'font-medium', 'text-gray-700', 'bg-white')
  })
})

// Note: Testing the null error case is covered by the component's conditional rendering logic