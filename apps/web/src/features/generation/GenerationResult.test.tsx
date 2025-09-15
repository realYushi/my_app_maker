import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GenerationResult from './GenerationResult'
import type { GenerationResult as GenerationResultType } from '@mini-ai-app-builder/shared-types'

// Mock the child components
vi.mock('./GeneratedApp', () => ({
  default: ({ generationResult }: { generationResult: GenerationResultType }) => (
    <div data-testid="generated-app">
      Generated App for {generationResult.appName}
    </div>
  )
}))

vi.mock('./ErrorDisplay', () => ({
  default: () => (
    <div data-testid="error-display">
      Error Display Component
    </div>
  )
}))

// Mock the context to control state
const mockContextValue = {
  status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  userInput: '',
  generationResult: null as GenerationResultType | null,
  error: null as string | null,
  setUserInput: vi.fn(),
  setLoading: vi.fn(),
  setSuccess: vi.fn(),
  setError: vi.fn(),
  reset: vi.fn(),
  generateApp: vi.fn()
}

vi.mock('../../contexts/AppContext', async () => {
  const actual = await vi.importActual('../../contexts/AppContext')
  return {
    ...actual,
    useAppContext: () => mockContextValue
  }
})

const mockGenerationResult: GenerationResultType = {
  appName: 'Task Manager App',
  entities: [
    { name: 'Task', attributes: ['id', 'title', 'description', 'dueDate'] },
    { name: 'User', attributes: ['id', 'username', 'email'] }
  ],
  userRoles: [
    { name: 'Admin', description: 'Can manage all tasks and users' },
    { name: 'User', description: 'Can manage own tasks' }
  ],
  features: [
    { name: 'Task Creation', description: 'Users can create and edit tasks' },
    { name: 'Due Date Tracking', description: 'Track and notify about due dates' }
  ]
}

describe('GenerationResult', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockContextValue.status = 'idle'
    mockContextValue.generationResult = null
    mockContextValue.error = null
  })

  it('renders nothing when status is idle', () => {
    const { container } = render(<GenerationResult />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when status is loading', () => {
    mockContextValue.status = 'loading'
    const { container } = render(<GenerationResult />)
    expect(container.firstChild).toBeNull()
  })

  it('renders error state correctly', () => {
    mockContextValue.status = 'error'
    mockContextValue.error = 'Something went wrong'

    render(<GenerationResult />)

    expect(screen.getByTestId('error-display')).toBeInTheDocument()
    expect(screen.getByText('Error Display Component')).toBeInTheDocument()
  })

  it('renders success state with generation result', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    expect(screen.getByTestId('generated-app')).toBeInTheDocument()
    expect(screen.getByText('Generated App for Task Manager App')).toBeInTheDocument()
  })

  it('passes correct generationResult to GeneratedApp', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    expect(screen.getByTestId('generated-app')).toBeInTheDocument()
    expect(screen.getByText('Generated App for Task Manager App')).toBeInTheDocument()
  })

  it('handles empty generation result', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = {
      appName: 'Empty App',
      entities: [],
      userRoles: [],
      features: []
    }

    render(<GenerationResult />)

    expect(screen.getByTestId('generated-app')).toBeInTheDocument()
    expect(screen.getByText('Generated App for Empty App')).toBeInTheDocument()
  })
})