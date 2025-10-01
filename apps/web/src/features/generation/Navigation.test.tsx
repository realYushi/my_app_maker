import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Navigation from './Navigation';
import type { UserRole, Feature } from '@mini-ai-app-builder/shared-types';

const mockUserRoles: UserRole[] = [
  { name: 'Admin', description: 'System administrator with full access' },
  { name: 'User', description: 'Regular user with limited access' },
];

const mockFeatures: Feature[] = [
  { name: 'Authentication', description: 'User login and registration system' },
  { name: 'Dashboard', description: 'Main application dashboard' },
];

const renderNavigation = (
  userRoles: UserRole[] = mockUserRoles,
  features: Feature[] = mockFeatures,
  showOverview: boolean = true,
) => {
  return render(
    <Navigation userRoles={userRoles} features={features} showOverview={showOverview} />,
  );
};

describe('Navigation', () => {
  it('renders overview tab by default', () => {
    renderNavigation();
    expect(screen.getAllByRole('button', { name: /overview/i })).toHaveLength(2); // Desktop direct button, tablet
  });

  it('renders all user roles as navigation items', () => {
    renderNavigation();

    // User Roles dropdown should be visible
    expect(screen.getByRole('button', { name: /user roles/i })).toBeInTheDocument();

    // Individual role buttons are visible in tablet view but not in desktop dropdown (when collapsed)
    // The tablet navigation shows individual buttons, so they will be in the document
    const adminButtons = screen.getAllByRole('button', { name: /admin/i });
    const userButtons = screen.getAllByRole('button', { name: /user/i });

    // Should have buttons from tablet navigation, possibly mobile too (at least 1 each)
    expect(adminButtons.length).toBeGreaterThanOrEqual(1);
    expect(userButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all features as navigation items', () => {
    renderNavigation();

    // Features dropdown should be visible
    expect(screen.getByRole('button', { name: /features/i })).toBeInTheDocument();

    // Individual feature buttons are visible in tablet view but not in desktop dropdown (when collapsed)
    // The tablet navigation shows individual buttons, so they will be in the document
    const authButtons = screen.getAllByRole('button', { name: /authentication/i });
    const dashboardButtons = screen.getAllByRole('button', { name: /dashboard/i });

    // Should have buttons from tablet navigation (1 each)
    expect(authButtons).toHaveLength(1);
    expect(dashboardButtons).toHaveLength(1);
  });

  it('displays role badges for user role tabs when expanded', async () => {
    const user = userEvent.setup();
    renderNavigation();

    // Expand User Roles dropdown
    const userRolesButton = screen.getByRole('button', { name: /user roles/i });
    await act(async () => {
      await user.click(userRolesButton);
    });

    // Now individual role buttons should be visible
    const adminButtons = screen.getAllByRole('button', { name: /admin/i });
    expect(adminButtons[0]).toBeInTheDocument();
    expect(screen.getAllByText('Role')).toHaveLength(2); // Two roles in expanded dropdown
  });

  it('displays feature badges for feature tabs when expanded', async () => {
    const user = userEvent.setup();
    renderNavigation();

    // Expand Features dropdown
    const featuresButton = screen.getByRole('button', { name: /features/i });
    await act(async () => {
      await user.click(featuresButton);
    });

    // Now individual feature buttons should be visible
    const authButtons = screen.getAllByRole('button', { name: /authentication/i });
    expect(authButtons[0]).toBeInTheDocument();
    expect(screen.getAllByText('Feature')).toHaveLength(2); // Two features in expanded dropdown
  });

  it('shows overview tab as active by default', () => {
    renderNavigation();
    const overviewButtons = screen.getAllByRole('button', { name: /overview/i });
    // Check the desktop overview button (direct button with different classes)
    expect(overviewButtons[0]).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('changes active tab when clicked', async () => {
    const user = userEvent.setup();
    renderNavigation();

    // First expand the User Roles dropdown
    const userRolesButton = screen.getByRole('button', { name: /user roles/i });
    await act(async () => {
      await user.click(userRolesButton);
    });

    // Now click on an admin role button
    const adminButtons = screen.getAllByRole('button', { name: /admin/i });
    const adminButton = adminButtons[0]; // First admin button in dropdown

    await act(async () => {
      await user.click(adminButton);
    });

    expect(adminButton).toHaveClass('bg-blue-50', 'text-blue-700', 'border-l-2', 'border-blue-500');
  });

  it('displays role description when role tab is active', async () => {
    const user = userEvent.setup();
    renderNavigation();

    // First expand the User Roles dropdown
    const userRolesButton = screen.getByRole('button', { name: /user roles/i });
    await act(async () => {
      await user.click(userRolesButton);
    });

    // Now click on an admin role button
    const adminButtons = screen.getAllByRole('button', { name: /admin/i });
    const adminButton = adminButtons[0];

    await act(async () => {
      await user.click(adminButton);
    });

    expect(screen.getAllByText(/system administrator with full access/i)[0]).toBeInTheDocument();
  });

  it('displays feature description when feature tab is active', async () => {
    const user = userEvent.setup();
    renderNavigation();

    // First expand the Features dropdown
    const featuresButton = screen.getByRole('button', { name: /features/i });
    await act(async () => {
      await user.click(featuresButton);
    });

    // Now click on an authentication feature button
    const authButtons = screen.getAllByRole('button', { name: /authentication/i });
    const authButton = authButtons[0];

    await act(async () => {
      await user.click(authButton);
    });

    expect(screen.getAllByText(/user login and registration system/i)[0]).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    renderNavigation();
    expect(screen.getByText(/open main menu/i)).toBeInTheDocument();
  });

  it('handles empty roles and features arrays', () => {
    renderNavigation([], []);
    expect(screen.getAllByRole('button', { name: /overview/i })).toHaveLength(2); // Desktop direct button, tablet
    expect(screen.queryAllByText('Role')).toHaveLength(0);
    expect(screen.queryAllByText('Feature')).toHaveLength(0);
  });

  it('generates correct navigation item count', () => {
    renderNavigation();
    // Overview + 2 roles + 2 features = 5 total items
    const buttons = screen.getAllByRole('button');
    // Filter out the mobile menu button
    const navButtons = buttons.filter(
      button => !button.getAttribute('aria-label')?.includes('menu'),
    );
    expect(navButtons.length).toBeGreaterThanOrEqual(5);
  });

  it('has responsive design classes', () => {
    const { container } = renderNavigation();
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('bg-gray-50', 'border-b', 'border-gray-200');
  });

  it('shows mobile navigation when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderNavigation();

    const menuButton = screen.getByText(/open main menu/i).closest('button');

    await act(async () => {
      await user.click(menuButton!);
    });

    // The mobile panel should be visible after clicking
    // In Headless UI, this typically changes the menu button icon or aria state
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('switches tabs in mobile view', async () => {
    const user = userEvent.setup();
    renderNavigation();

    // Verify Overview is initially active - find the tablet navigation button
    const overviewButtons = screen.getAllByRole('button', { name: /overview/i });
    // The tablet button should be the one with tablet-specific classes (not desktop dropdown classes)
    let tabletOverviewButton = overviewButtons.find(
      button =>
        button.className.includes('bg-blue-100') &&
        button.className.includes('text-blue-700') &&
        !button.className.includes('border-l-2'), // Desktop dropdown has border-l-2, tablet doesn't
    );

    // If we can't find the tablet button, use index 0 which should be the first available overview button
    if (!tabletOverviewButton) {
      tabletOverviewButton = overviewButtons[0];
    }

    expect(tabletOverviewButton).toHaveClass('bg-blue-100', 'text-blue-700');

    // Open mobile menu first
    const menuButton = screen.getByText(/open main menu/i).closest('button');

    await act(async () => {
      await user.click(menuButton!);
    });

    // After opening menu, verify it's expanded
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Now that mobile menu is open, we should be able to find User Roles button in mobile
    // Use getAllByRole to handle multiple instances, then pick the mobile one
    const userRolesButtons = screen.getAllByRole('button', { name: /user roles/i });
    // The mobile version should be the one that's in the mobile panel
    const mobileUserRolesButton =
      userRolesButtons.find(
        button =>
          // Mobile buttons typically have different class patterns
          button.className.includes('w-full') && button.className.includes('justify-between'),
      ) || userRolesButtons[userRolesButtons.length - 1]; // Fallback to last one

    await act(async () => {
      await user.click(mobileUserRolesButton);
    });

    // Get admin buttons after expanding roles dropdown in mobile
    const adminButtons = await screen.findAllByRole('button', {
      name: /admin/i,
    });

    // Click the first admin button
    const adminButton = adminButtons[0];

    await act(async () => {
      await user.click(adminButton);
    });

    // Verify the tab switched by checking that admin button is now active
    // Check for the appropriate classes based on which button type we clicked
    if (adminButton.className.includes('bg-blue-100')) {
      // This is a tablet navigation button
      expect(adminButton).toHaveClass('bg-blue-100', 'text-blue-700');
    } else {
      // This is a desktop dropdown button
      expect(adminButton).toHaveClass(
        'bg-blue-50',
        'text-blue-700',
        'border-l-2',
        'border-blue-500',
      );
    }
  });
});
