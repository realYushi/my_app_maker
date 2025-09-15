import { render, screen, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import Navigation from './Navigation'
import type { UserRole, Feature } from '@mini-ai-app-builder/shared-types'

const mockUserRoles: UserRole[] = [
  { name: 'Admin', description: 'System administrator with full access' },
  { name: 'User', description: 'Regular user with limited access' }
]

const mockFeatures: Feature[] = [
  { name: 'Authentication', description: 'User login and registration system' },
  { name: 'Dashboard', description: 'Main application dashboard' }
]

const renderNavigation = (userRoles: UserRole[] = mockUserRoles, features: Feature[] = mockFeatures) => {
  return render(<Navigation userRoles={userRoles} features={features} />)
}

describe('Navigation', () => {
  it('renders overview tab by default', () => {
    renderNavigation()
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument()
  })

  it('renders all user roles as navigation items', () => {
    renderNavigation()
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument()
  })

  it('renders all features as navigation items', () => {
    renderNavigation()
    expect(screen.getByRole('button', { name: /authentication/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('displays role badges for user role tabs', () => {
    renderNavigation()
    const adminButton = screen.getByRole('button', { name: /admin/i })
    expect(adminButton).toBeInTheDocument()
    expect(screen.getAllByText('Role')).toHaveLength(2) // Two role badges
  })

  it('displays feature badges for feature tabs', () => {
    renderNavigation()
    const authButton = screen.getByRole('button', { name: /authentication/i })
    expect(authButton).toBeInTheDocument()
    expect(screen.getAllByText('Feature')).toHaveLength(2) // Two feature badges
  })

  it('shows overview tab as active by default', () => {
    renderNavigation()
    const overviewButton = screen.getByRole('button', { name: /overview/i })
    expect(overviewButton).toHaveClass('bg-blue-100', 'text-blue-700')
  })

  it('changes active tab when clicked', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const adminButton = screen.getByRole('button', { name: /admin/i })

    await act(async () => {
      await user.click(adminButton)
    })

    expect(adminButton).toHaveClass('bg-blue-100', 'text-blue-700')
  })

  it('displays role description when role tab is active', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const adminButton = screen.getByRole('button', { name: /admin/i })

    await act(async () => {
      await user.click(adminButton)
    })

    expect(screen.getByText(/system administrator with full access/i)).toBeInTheDocument()
  })

  it('displays feature description when feature tab is active', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const authButton = screen.getByRole('button', { name: /authentication/i })

    await act(async () => {
      await user.click(authButton)
    })

    expect(screen.getByText(/user login and registration system/i)).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    renderNavigation()
    expect(screen.getByText(/open main menu/i)).toBeInTheDocument()
  })

  it('handles empty roles and features arrays', () => {
    renderNavigation([], [])
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument()
    expect(screen.queryAllByText('Role')).toHaveLength(0)
    expect(screen.queryAllByText('Feature')).toHaveLength(0)
  })

  it('generates correct navigation item count', () => {
    renderNavigation()
    // Overview + 2 roles + 2 features = 5 total items
    const buttons = screen.getAllByRole('button')
    // Filter out the mobile menu button
    const navButtons = buttons.filter(button =>
      !button.getAttribute('aria-label')?.includes('menu')
    )
    expect(navButtons.length).toBeGreaterThanOrEqual(5)
  })

  it('has responsive design classes', () => {
    const { container } = renderNavigation()
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('bg-gray-50', 'border-b', 'border-gray-200')
  })

  it('shows mobile navigation when menu button is clicked', async () => {
    const user = userEvent.setup()
    renderNavigation()

    const menuButton = screen.getByText(/open main menu/i).closest('button')

    await act(async () => {
      await user.click(menuButton!)
    })

    // The mobile panel should be visible after clicking
    // In Headless UI, this typically changes the menu button icon or aria state
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('switches tabs in mobile view', async () => {
    const user = userEvent.setup()
    renderNavigation()

    // Verify Overview is initially active
    const overviewButton = screen.getByRole('button', { name: /overview/i })
    expect(overviewButton).toHaveClass('bg-blue-100', 'text-blue-700')

    // Open mobile menu first
    const menuButton = screen.getByText(/open main menu/i).closest('button')

    await act(async () => {
      await user.click(menuButton!)
    })

    // After opening menu, verify it's expanded
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    // Get all admin buttons (desktop and mobile)
    const adminButtons = await screen.findAllByRole('button', {
      name: /admin/i
    })

    // The mobile button should be the second one (index 1)
    const mobileAdminButton = adminButtons[1]

    // Click the mobile admin button
    await act(async () => {
      await user.click(mobileAdminButton)
    })

    // Verify the tab switched - overview should no longer be active and admin should be active
    expect(overviewButton).not.toHaveClass('bg-blue-100', 'text-blue-700')
    // Check the desktop admin button for active state since mobile panel closes
    const desktopAdminButton = adminButtons[0]
    expect(desktopAdminButton).toHaveClass('bg-blue-100', 'text-blue-700')
  })
})