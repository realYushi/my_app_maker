import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserProfile from './UserProfile'
import type { Entity } from '@mini-ai-app-builder/shared-types'

const mockUserEntity: Entity = {
  name: 'John Doe',
  attributes: ['role:admin', 'email', 'phone', 'location', 'department', 'status']
}

const mockMemberEntity: Entity = {
  name: 'Jane Smith',
  attributes: ['email', 'phone', 'bio', 'skills', 'joined_date']
}

describe('UserProfile', () => {
  it('renders user profile with correct name', () => {
    render(<UserProfile entity={mockUserEntity} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays avatar with correct initials', () => {
    render(<UserProfile entity={mockUserEntity} />)
    const avatar = screen.getByText('JD')
    expect(avatar).toBeInTheDocument()
  })

  it('shows admin role for admin users', () => {
    render(<UserProfile entity={mockUserEntity} />)
    expect(screen.getByText('👑')).toBeInTheDocument()
    expect(screen.getByText('Administrator')).toBeInTheDocument()
  })

  it('shows member role for regular users', () => {
    render(<UserProfile entity={mockMemberEntity} />)
    expect(screen.getByText('👤')).toBeInTheDocument()
    expect(screen.getByText('Member')).toBeInTheDocument()
  })

  it('displays online/offline status indicator', () => {
    render(<UserProfile entity={mockUserEntity} />)
    // Should show either "Online now" or "Last seen X min ago"
    const statusElement = screen.getByText(/Online now|Last seen/)
    expect(statusElement).toBeInTheDocument()
  })

  it('renders user attributes section', () => {
    render(<UserProfile entity={mockUserEntity} />)
    expect(screen.getByText('Profile Details')).toBeInTheDocument()
  })

  it('shows action buttons', () => {
    render(<UserProfile entity={mockUserEntity} />)
    expect(screen.getByText('📝 Edit Profile')).toBeInTheDocument()
    expect(screen.getByText('💬 Send Message')).toBeInTheDocument()
  })

  it('handles users with single name correctly', () => {
    const singleNameEntity: Entity = {
      name: 'Madonna',
      attributes: ['role:artist']
    }
    render(<UserProfile entity={singleNameEntity} />)
    expect(screen.getByText('Madonna')).toBeInTheDocument()
    expect(screen.getByText('MA')).toBeInTheDocument()
  })

  it('handles empty attributes array', () => {
    const emptyEntity: Entity = {
      name: 'Test User',
      attributes: []
    }
    render(<UserProfile entity={emptyEntity} />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})