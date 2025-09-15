import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EntityForm from './EntityForm'
import type { Entity } from '@mini-ai-app-builder/shared-types'

const mockEntity: Entity = {
  name: 'User',
  attributes: ['name', 'email', 'password', 'age', 'description']
}

const mockEntityWithSpecialFields: Entity = {
  name: 'Product',
  attributes: ['title', 'category', 'status', 'url', 'notes', 'phoneNumber', 'createdDate']
}

const renderEntityForm = (entity: Entity = mockEntity) => {
  return render(<EntityForm entity={entity} />)
}

describe('EntityForm', () => {
  it('renders entity name as heading', () => {
    renderEntityForm()
    expect(screen.getByRole('heading', { name: 'User' })).toBeInTheDocument()
  })

  it('displays correct field count badge', () => {
    renderEntityForm()
    expect(screen.getByText('5 fields')).toBeInTheDocument()
  })

  it('renders all entity attributes as form fields', () => {
    renderEntityForm()
    expect(screen.getByLabelText('name')).toBeInTheDocument()
    expect(screen.getByLabelText('email')).toBeInTheDocument()
    expect(screen.getByLabelText('password')).toBeInTheDocument()
    expect(screen.getByLabelText('age')).toBeInTheDocument()
    expect(screen.getByLabelText('description')).toBeInTheDocument()
  })

  it('uses appropriate input types based on attribute names', () => {
    renderEntityForm(mockEntityWithSpecialFields)

    // Email type
    const titleField = screen.getByLabelText('title')
    expect(titleField).toHaveAttribute('type', 'text')

    // URL type
    const urlField = screen.getByLabelText('url')
    expect(urlField).toHaveAttribute('type', 'url')

    // Tel type for phone
    const phoneField = screen.getByLabelText('phoneNumber')
    expect(phoneField).toHaveAttribute('type', 'tel')

    // Date type
    const dateField = screen.getByLabelText('createdDate')
    expect(dateField).toHaveAttribute('type', 'date')
  })

  it('renders textarea for description-like fields', () => {
    renderEntityForm()
    const descriptionField = screen.getByLabelText('description')
    expect(descriptionField.tagName).toBe('TEXTAREA')
    expect(descriptionField).toHaveAttribute('rows', '3')
  })

  it('renders select dropdown for category/status fields', () => {
    renderEntityForm(mockEntityWithSpecialFields)

    const categoryField = screen.getByLabelText('category')
    expect(categoryField.tagName).toBe('SELECT')
    expect(categoryField).toContainHTML('<option value="">Select category</option>')

    const statusField = screen.getByLabelText('status')
    expect(statusField.tagName).toBe('SELECT')
    expect(statusField).toContainHTML('<option value="">Select status</option>')
  })

  it('renders save and cancel buttons', () => {
    renderEntityForm()
    expect(screen.getByRole('button', { name: 'Save User' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('has all form fields disabled', () => {
    renderEntityForm()
    const nameField = screen.getByLabelText('name')
    const emailField = screen.getByLabelText('email')
    const passwordField = screen.getByLabelText('password')
    const ageField = screen.getByLabelText('age')
    const descriptionField = screen.getByLabelText('description')

    expect(nameField).toBeDisabled()
    expect(emailField).toBeDisabled()
    expect(passwordField).toBeDisabled()
    expect(ageField).toBeDisabled()
    expect(descriptionField).toBeDisabled()
  })

  it('has all buttons disabled', () => {
    renderEntityForm()
    const saveButton = screen.getByRole('button', { name: 'Save User' })
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })

    expect(saveButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('displays non-functional form disclaimer', () => {
    renderEntityForm()
    expect(screen.getByText(/this is a non-functional form for preview purposes only/i)).toBeInTheDocument()
  })

  it('generates appropriate placeholders', () => {
    renderEntityForm()
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
  })

  it('handles entity with no attributes', () => {
    const emptyEntity: Entity = { name: 'Empty', attributes: [] }
    renderEntityForm(emptyEntity)

    expect(screen.getByRole('heading', { name: 'Empty' })).toBeInTheDocument()
    expect(screen.getByText('0 fields')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Empty' })).toBeInTheDocument()
  })

  it('correctly identifies number field types', () => {
    const entityWithNumbers: Entity = {
      name: 'Stats',
      attributes: ['count', 'number', 'ageValue']
    }
    renderEntityForm(entityWithNumbers)

    expect(screen.getByLabelText('count')).toHaveAttribute('type', 'number')
    expect(screen.getByLabelText('number')).toHaveAttribute('type', 'number')
    expect(screen.getByLabelText('ageValue')).toHaveAttribute('type', 'number')
  })

  it('correctly identifies password fields', () => {
    const entityWithPassword: Entity = {
      name: 'Auth',
      attributes: ['password', 'confirmPassword']
    }
    renderEntityForm(entityWithPassword)

    expect(screen.getByLabelText('password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('confirmPassword')).toHaveAttribute('type', 'password')
  })

  it('has responsive design classes', () => {
    const { container } = renderEntityForm()
    const formContainer = container.firstChild as HTMLElement
    expect(formContainer).toHaveClass('bg-white', 'border', 'border-gray-200', 'rounded-lg', 'hover:shadow-md')
  })

  it('renders form fields with proper accessibility labels', () => {
    renderEntityForm()

    const nameField = screen.getByLabelText('name')
    expect(nameField).toHaveAttribute('id', 'User-name')

    const emailField = screen.getByLabelText('email')
    expect(emailField).toHaveAttribute('id', 'User-email')
  })

  it('maintains proper form structure', () => {
    renderEntityForm()

    // Even if not explicitly a form element, it should contain form-like structure
    expect(screen.getByLabelText('name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save User' })).toBeInTheDocument()
  })
})