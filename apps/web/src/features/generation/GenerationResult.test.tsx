import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GenerationResult from './GenerationResult'
import type { GenerationResult as GenerationResultType } from '@mini-ai-app-builder/shared-types'

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

    expect(screen.getByText('Generation Failed')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('calls reset when try again is clicked', () => {
    mockContextValue.status = 'error'
    mockContextValue.error = 'Something went wrong'

    render(<GenerationResult />)

    fireEvent.click(screen.getByText('Try again'))
    expect(mockContextValue.reset).toHaveBeenCalledTimes(1)
  })

  it('renders success state with generation result', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    expect(screen.getByText('Generated App Structure')).toBeInTheDocument()
    expect(screen.getByText('Task Manager App')).toBeInTheDocument()
    expect(screen.getByText('Generate New App')).toBeInTheDocument()
  })

  it('renders entities section correctly', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    expect(screen.getByText('Entities')).toBeInTheDocument()
    expect(screen.getByText('Task')).toBeInTheDocument()
    expect(screen.getAllByText('User')).toHaveLength(2) // One in entities, one in user roles
    expect(screen.getAllByText('id')).toHaveLength(2) // One for Task, one for User entity
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('email')).toBeInTheDocument()
  })

  it('renders user roles section correctly', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    expect(screen.getByText('User Roles')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Can manage all tasks and users')).toBeInTheDocument()
    expect(screen.getByText('Can manage own tasks')).toBeInTheDocument()
  })

  it('renders features section correctly', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Task Creation')).toBeInTheDocument()
    expect(screen.getByText('Users can create and edit tasks')).toBeInTheDocument()
    expect(screen.getByText('Due Date Tracking')).toBeInTheDocument()
  })

  it('calls reset when Generate New App is clicked', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = mockGenerationResult

    render(<GenerationResult />)

    fireEvent.click(screen.getByText('Generate New App'))
    expect(mockContextValue.reset).toHaveBeenCalledTimes(1)
  })

  it('handles empty arrays in generation result', () => {
    mockContextValue.status = 'success'
    mockContextValue.generationResult = {
      appName: 'Empty App',
      entities: [],
      userRoles: [],
      features: []
    }

    render(<GenerationResult />)

    expect(screen.getByText('Generated App Structure')).toBeInTheDocument()
    expect(screen.getByText('Empty App')).toBeInTheDocument()
    expect(screen.queryByText('Entities')).not.toBeInTheDocument()
    expect(screen.queryByText('User Roles')).not.toBeInTheDocument()
    expect(screen.queryByText('Features')).not.toBeInTheDocument()
  })
})