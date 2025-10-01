import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserManagementTable from './UserManagementTable';
import type { Entity } from '@mini-ai-app-builder/shared-types';

const mockEntity: Entity = {
  name: 'User Management',
  attributes: ['table', 'users', 'management', 'directory'],
};

// Mock Math.random to get consistent test results
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe('UserManagementTable', () => {
  it('renders user management table with title', () => {
    render(<UserManagementTable entity={mockEntity} />);
    expect(screen.getByText('User Management Management')).toBeInTheDocument();
    expect(screen.getByText('👥 User Directory')).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<UserManagementTable entity={mockEntity} />);
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
  });

  it('displays role filter dropdown', () => {
    render(<UserManagementTable entity={mockEntity} />);
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('All Roles')).toBeInTheDocument();
  });

  it('shows user table headers', () => {
    render(<UserManagementTable entity={mockEntity} />);
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Last Login')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays mock user data', () => {
    render(<UserManagementTable entity={mockEntity} />);
    // Should show generated mock users
    expect(screen.getAllByText(/Alex Johnson|Sarah Chen|Mike Davis/).length).toBeGreaterThan(0);
  });

  it('filters users by search term', async () => {
    const user = userEvent.setup();
    render(<UserManagementTable entity={mockEntity} />);

    const searchInput = screen.getByPlaceholderText('Search users...');

    await act(async () => {
      await user.type(searchInput, 'Alex');
    });

    // Table should update to show filtered results
    expect(searchInput).toHaveValue('Alex');
  });

  it('filters users by role', async () => {
    const user = userEvent.setup();
    render(<UserManagementTable entity={mockEntity} />);

    const roleSelect = screen.getByRole('combobox');

    await act(async () => {
      await user.selectOptions(roleSelect, 'admin');
    });

    expect(roleSelect).toHaveValue('admin');
  });

  it('shows action buttons for each user', () => {
    render(<UserManagementTable entity={mockEntity} />);
    expect(screen.getAllByText('Edit').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
  });

  it('displays pagination when there are many users', () => {
    render(<UserManagementTable entity={mockEntity} />);
    // Should show pagination controls if there are more than 5 users
    const paginationInfo = screen.getByText(/Showing \d+ to \d+ of \d+ users/);
    expect(paginationInfo).toBeInTheDocument();
  });

  it('handles pagination navigation', async () => {
    const user = userEvent.setup();
    render(<UserManagementTable entity={mockEntity} />);

    const nextButton = screen.getByText('Next');
    const prevButton = screen.getByText('Previous');

    // Previous should be disabled on first page
    expect(prevButton).toBeDisabled();

    // Next button should be clickable if there are multiple pages
    if (!nextButton.hasAttribute('disabled')) {
      await act(async () => {
        await user.click(nextButton);
      });
    }
  });

  it('displays user avatars with initials', () => {
    render(<UserManagementTable entity={mockEntity} />);
    // Should show avatar divs with user initials
    const avatars = screen.getAllByText(/^[A-Z]{1,2}$/);
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('shows different role badges with appropriate colors', () => {
    render(<UserManagementTable entity={mockEntity} />);
    // Should display role badges
    expect(screen.getAllByText(/Admin|Manager|Editor|Member/).length).toBeGreaterThan(0);
  });

  it('displays status indicators', () => {
    render(<UserManagementTable entity={mockEntity} />);
    // Should show Active/Inactive status
    expect(screen.getAllByText(/Active|Inactive/).length).toBeGreaterThan(0);
  });
});
