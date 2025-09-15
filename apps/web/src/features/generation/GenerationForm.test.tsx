import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import GenerationForm from './GenerationForm'
import { AppProvider } from '../../contexts/AppContext'

// Mock the generation service
vi.mock('../../services/generationService', () => ({
  generationService: {
    generateApp: vi.fn()
  }
}))

import { generationService } from '../../services/generationService'
const mockGenerateApp = vi.mocked(generationService.generateApp)

const renderGenerationForm = () => {
  return render(
    <AppProvider>
      <GenerationForm />
    </AppProvider>
  )
}

describe('GenerationForm', () => {
  it('renders form elements correctly', () => {
    renderGenerationForm()

    expect(screen.getByLabelText(/describe your app idea/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/tell us about your app idea/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
    expect(screen.getByText(/be as detailed as possible/i)).toBeInTheDocument()
  })

  it('initially has an empty textarea and disabled button', () => {
    renderGenerationForm()

    const textarea = screen.getByLabelText(/describe your app idea/i)
    const button = screen.getByRole('button', { name: /generate/i })

    expect(textarea).toHaveValue('')
    expect(button).toBeDisabled()
  })

  it('enables button when text is entered', async () => {
    const user = userEvent.setup()
    renderGenerationForm()

    const textarea = screen.getByLabelText(/describe your app idea/i)
    const button = screen.getByRole('button', { name: /generate/i })

    await act(async () => {
      await user.type(textarea, 'My app idea')
    })

    expect(button).toBeEnabled()
  })

  it('disables button with only whitespace', async () => {
    const user = userEvent.setup()
    renderGenerationForm()

    const textarea = screen.getByLabelText(/describe your app idea/i)
    const button = screen.getByRole('button', { name: /generate/i })

    await act(async () => {
      await user.type(textarea, '   ')
    })

    expect(button).toBeDisabled()
  })

  it('shows loading state when form is submitted', async () => {
    // Mock a promise that never resolves to keep loading state
    mockGenerateApp.mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()
    renderGenerationForm()

    const textarea = screen.getByLabelText(/describe your app idea/i)
    const button = screen.getByRole('button', { name: /generate/i })

    await act(async () => {
      await user.type(textarea, 'My app idea')
    })

    await act(async () => {
      await user.click(button)
    })

    // Wait for loading state to appear
    await waitFor(() => {
      expect(screen.getByText(/generating\.\.\./i)).toBeInTheDocument()
    })

    expect(button).toBeDisabled()
    expect(textarea).toBeDisabled()
  })

  it('handles form submission', async () => {
    // Mock a promise that never resolves to keep loading state
    mockGenerateApp.mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()
    renderGenerationForm()

    const textarea = screen.getByLabelText(/describe your app idea/i)
    const form = textarea.closest('form')

    await act(async () => {
      await user.type(textarea, 'My app idea')
    })

    await act(async () => {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      fireEvent(form!, submitEvent)
    })

    await waitFor(() => {
      expect(screen.getByText(/generating\.\.\./i)).toBeInTheDocument()
    })
  })
})