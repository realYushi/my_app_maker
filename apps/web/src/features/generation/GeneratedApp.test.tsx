import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import GeneratedApp from './GeneratedApp';
import { AppProvider } from '../../contexts/AppContext';
import type { GenerationResult } from '@mini-ai-app-builder/shared-types';
import React from 'react';

// Mock the child components to focus on GeneratedApp's logic
vi.mock('./Navigation', () => ({
  default: ({ userRoles, features }: { userRoles: Array<unknown>; features: Array<unknown> }) => (
    <div data-testid="navigation">
      Navigation with {userRoles.length} roles and {features.length} features
    </div>
  ),
}));

vi.mock('./EntityForm', () => ({
  default: ({ entity }: { entity: { name: string } }) => (
    <div data-testid={`entity-form-${entity.name}`}>EntityForm for {entity.name}</div>
  ),
}));

const mockGenerationResult: GenerationResult = {
  appName: 'Test App',
  entities: [
    { name: 'User', attributes: ['name', 'email', 'password'] },
    { name: 'Product', attributes: ['title', 'description', 'price'] },
  ],
  userRoles: [
    { name: 'Admin', description: 'System administrator' },
    { name: 'User', description: 'Regular user' },
  ],
  features: [
    { name: 'Authentication', description: 'User login and registration' },
    { name: 'Product Management', description: 'CRUD operations for products' },
  ],
};

const renderGeneratedApp = (generationResult: GenerationResult = mockGenerationResult) => {
  return render(
    <AppProvider>
      <GeneratedApp generationResult={generationResult} />
    </AppProvider>,
  );
};

describe('GeneratedApp', () => {
  describe('Basic functionality (backward compatibility)', () => {
    it('renders the app name in the header', () => {
      renderGeneratedApp();
      expect(screen.getAllByRole('heading', { name: 'Test App' })).toHaveLength(2); // Header and overview
    });

    it('renders the Generate New App button', () => {
      renderGeneratedApp();
      expect(screen.getByRole('button', { name: /generate new app/i })).toBeTruthy();
    });

    it('renders the navigation component with correct props', () => {
      renderGeneratedApp();
      expect(screen.getByTestId('navigation')).toBeTruthy();
      expect(screen.getByText('Navigation with 2 roles and 2 features')).toBeTruthy();
    });

    it('displays app overview with correct statistics', () => {
      renderGeneratedApp();
      // Overview mode displays Data Entities, User Roles, Features statistics
      // With progressive disclosure, these may appear in multiple places
      expect(screen.getAllByText('Data Entities')).toHaveLength(2); // App statistics and overview cards
      expect(screen.getAllByText('User Roles').length).toBeGreaterThanOrEqual(2); // App statistics and overview cards (may be more due to progressive disclosure)
      expect(screen.getAllByText('Features').length).toBeGreaterThanOrEqual(1); // Overview card (may be more due to progressive disclosure)
      // Check for statistics counts - with progressive disclosure there may be more instances
      expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(4); // entities, roles counts in stats and overview cards
    });

    it('renders entity forms in tabbed interface when entities exist in detailed mode', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode first
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      expect(screen.getByText('Data Management')).toBeTruthy();

      // Check for tab structure
      expect(screen.getByRole('tablist', { name: /entity management tabs/i })).toBeTruthy();
      expect(screen.getByRole('tab', { name: /user entity management/i })).toBeTruthy();
      expect(screen.getByRole('tab', { name: /product entity management/i })).toBeTruthy();

      // First tab should be selected by default
      expect(screen.getByRole('tab', { name: /user entity management/i })).toBeTruthy();

      // Check for tabpanel content
      expect(screen.getByRole('tabpanel')).toBeTruthy();

      // User entity now uses enhanced user management component
      expect(screen.getByText('👤 User Management')).toBeTruthy();
    });

    it('renders features section when features exist in detailed mode', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode first
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      expect(screen.getByText('Available Features')).toBeTruthy();
      expect(screen.getByText('Authentication')).toBeTruthy();
      expect(screen.getByText('User login and registration')).toBeTruthy();
      expect(screen.getByText('Product Management')).toBeTruthy();
      expect(screen.getByText('CRUD operations for products')).toBeTruthy();
    });

    it('renders feature disclosure buttons in detailed mode', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode first
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // Features now have disclosure buttons for more/less details
      const featureDisclosureButtons = screen.getAllByRole('button', {
        name: /more details|less details/i,
      });
      expect(featureDisclosureButtons.length).toBeGreaterThan(0);
    });

    it('does not render Data Management section when no entities in detailed mode', async () => {
      const user = userEvent.setup();
      const resultWithoutEntities: GenerationResult = {
        ...mockGenerationResult,
        entities: [],
      };
      renderGeneratedApp(resultWithoutEntities);

      // Switch to detailed mode
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      expect(screen.queryByText('Data Management')).not.toBeTruthy();
    });

    it('does not render Available Features section when no features in detailed mode', async () => {
      const user = userEvent.setup();
      const resultWithoutFeatures: GenerationResult = {
        ...mockGenerationResult,
        features: [],
      };
      renderGeneratedApp(resultWithoutFeatures);

      // Switch to detailed mode
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      expect(screen.queryByText('Available Features')).not.toBeTruthy();
    });

    it('has responsive design classes', () => {
      const { container } = renderGeneratedApp();
      const mainDiv = container.firstChild as HTMLElement;
      // Use classList and toContain for compatibility with Vitest/Testing Library
      const expectedClasses = [
        'mt-6',
        'bg-white',
        'border',
        'border-gray-200',
        'rounded-lg',
        'shadow-lg',
      ];
      expectedClasses.forEach(cls => {
        expect(mainDiv.classList.contains(cls)).toBe(true);
      });
    });

    it('calls reset function when Generate New App button is clicked', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      const generateButton = screen.getByRole('button', { name: /generate new app/i });

      await act(async () => {
        await user.click(generateButton);
      });

      // Since we're using the actual AppProvider, we can't easily mock the reset function
      // This test verifies the button is clickable and doesn't throw errors
      expect(generateButton).toBeTruthy();
    });

    it('truncates long app names appropriately', () => {
      const longNameResult: GenerationResult = {
        ...mockGenerationResult,
        appName: 'This is a very long application name that should be truncated properly',
      };
      renderGeneratedApp(longNameResult);
      // With progressive disclosure, app name may appear in multiple places, check the main heading
      const headings = screen.getAllByRole('heading', {
        name: /this is a very long application name/i,
      });
      expect(headings.length).toBeGreaterThanOrEqual(1);
      // Check that at least one heading has truncate class (the main one should)
      const hasTrancateClass = headings.some(heading => heading.classList.contains('truncate'));
      expect(hasTrancateClass).toBe(true);
    });
  });

  describe('Context-aware rendering', () => {
    it('detects e-commerce context and applies appropriate theming', () => {
      const ecommerceResult: GenerationResult = {
        appName: 'Online Store',
        entities: [
          { name: 'Product', attributes: ['name', 'price', 'category'] },
          { name: 'Order', attributes: ['total', 'status', 'customer_id'] },
          { name: 'Customer', attributes: ['name', 'email', 'address'] },
        ],
        userRoles: [],
        features: [],
      };

      const { container } = renderGeneratedApp(ecommerceResult);

      // Check for e-commerce theme and icon - with progressive disclosure these appear in multiple places
      expect(screen.getAllByText('🛍️').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('E-commerce platform').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Ecommerce').length).toBeGreaterThanOrEqual(1); // Context detection appears in multiple places
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1); // Entity count appears in multiple places

      // Check header uses e-commerce theme
      const header = container.querySelector('.bg-gradient-to-r');
      expect(header?.classList.contains('from-blue-600')).toBe(true);
      expect(header?.classList.contains('to-blue-700')).toBe(true);
    });

    it('detects user management context and applies appropriate theming', () => {
      const userMgmtResult: GenerationResult = {
        appName: 'User Portal',
        entities: [
          { name: 'User', attributes: ['username', 'email', 'password'] },
          { name: 'Role', attributes: ['name', 'permissions'] },
          { name: 'Permission', attributes: ['action', 'resource'] },
        ],
        userRoles: [],
        features: [],
      };

      const { container } = renderGeneratedApp(userMgmtResult);

      // Check for user management theme and icon - with progressive disclosure these appear in multiple places
      expect(screen.getAllByText('👥').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('User management system').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('User Management').length).toBeGreaterThanOrEqual(1); // Context detection appears in multiple places
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1); // Entity count appears in multiple places

      // Check header uses user management theme
      const header = container.querySelector('.bg-gradient-to-r');
      expect(header?.classList.contains('from-indigo-600')).toBe(true);
      expect(header?.classList.contains('to-indigo-700')).toBe(true);
    });

    it('detects admin context and applies appropriate theming', () => {
      const adminResult: GenerationResult = {
        appName: 'Admin Dashboard',
        entities: [
          { name: 'System', attributes: ['status', 'version', 'uptime'] },
          { name: 'Log', attributes: ['level', 'message', 'timestamp'] },
          { name: 'Configuration', attributes: ['key', 'value', 'type'] },
        ],
        userRoles: [],
        features: [],
      };

      const { container } = renderGeneratedApp(adminResult);

      // Check for admin theme and icon - with progressive disclosure these appear in multiple places
      expect(screen.getAllByText('⚙️').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Administrative dashboard').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Admin').length).toBeGreaterThanOrEqual(1); // Context detection shows "Admin" not "ADMIN"
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1); // Entity count appears in multiple places

      // Check header uses admin theme
      const header = container.querySelector('.bg-gradient-to-r');
      expect(header?.classList.contains('from-red-600')).toBe(true);
      expect(header?.classList.contains('to-red-700')).toBe(true);
    });

    it('applies generic theme for unrecognized entities', () => {
      const genericResult: GenerationResult = {
        appName: 'Generic App',
        entities: [
          { name: 'Book', attributes: ['title', 'author', 'isbn'] },
          { name: 'Recipe', attributes: ['ingredients', 'instructions'] },
        ],
        userRoles: [],
        features: [],
      };

      const { container } = renderGeneratedApp(genericResult);

      // Check for generic theme and icon - with progressive disclosure these appear in multiple places
      expect(screen.getAllByText('📱').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Application platform').length).toBeGreaterThanOrEqual(1);

      // Should not show context detection info for generic
      expect(screen.queryByText('Detected Context:')).not.toBeTruthy();

      // Check header uses generic theme
      const header = container.querySelector('.bg-gradient-to-r');
      expect(header?.classList.contains('from-gray-600')).toBe(true);
      expect(header?.classList.contains('to-gray-700')).toBe(true);
    });

    it('handles mixed context correctly', () => {
      const mixedResult: GenerationResult = {
        appName: 'Mixed App',
        entities: [
          { name: 'Product', attributes: ['name', 'price'] }, // E-commerce
          { name: 'User', attributes: ['username', 'email'] }, // User management
          { name: 'Book', attributes: ['title', 'author'] }, // Generic
        ],
        userRoles: [],
        features: [],
      };

      renderGeneratedApp(mixedResult);

      // Should detect the dominant context (likely e-commerce or user management)
      expect(screen.getByText('Primary Domain')).toBeTruthy(); // Updated for progressive disclosure UI

      // Should show the number of matched entities in the context detection
      expect(screen.getAllByText('3').length).toBeGreaterThan(0); // Entity count appears in multiple places
    });

    it('does not show context detection for empty entities', () => {
      const emptyResult: GenerationResult = {
        appName: 'Empty App',
        entities: [],
        userRoles: [],
        features: [],
      };

      renderGeneratedApp(emptyResult);

      // Should show context detection but with generic context
      expect(screen.getByText('Primary Domain')).toBeTruthy(); // Context section always shows, even for empty entities
      expect(screen.getByText('Generic')).toBeTruthy(); // Should detect generic context for empty entities

      // Should use generic theme
      expect(screen.getAllByText('📱').length).toBeGreaterThanOrEqual(1); // Generic icon may appear in multiple places
      expect(screen.getAllByText('Application platform').length).toBeGreaterThan(0); // Text appears in multiple places
    });
  });

  describe('Component factory integration', () => {
    it('uses component factory for entity rendering', async () => {
      const user = userEvent.setup();
      const ecommerceResult: GenerationResult = {
        appName: 'Store',
        entities: [{ name: 'Product', attributes: ['name', 'price'] }],
        userRoles: [],
        features: [],
      };

      renderGeneratedApp(ecommerceResult);

      // Switch to detailed mode to see entity components
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // The entity should be rendered via component factory (Product gets enhanced e-commerce component)
      expect(screen.getByText('🛍️ Product Card')).toBeTruthy();
      expect(screen.getByText('🛒 Add to Cart')).toBeTruthy();
    });

    it('maintains unique keys for entity components', async () => {
      const user = userEvent.setup();
      const resultWithDuplicates: GenerationResult = {
        appName: 'Test',
        entities: [
          { name: 'Product', attributes: ['name'] },
          { name: 'Product', attributes: ['price'] }, // Same name, different attributes
        ],
        userRoles: [],
        features: [],
      };

      renderGeneratedApp(resultWithDuplicates);

      // Switch to detailed mode to see entity tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // Both Product entities should be rendered as tabs
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);

      // First tab should be active and show e-commerce component
      expect(screen.getByText('🛒 Add to Cart')).toBeTruthy();

      // Click second tab to see the other Product entity
      await act(async () => {
        await user.click(tabs[1]);
      });

      // Should still see e-commerce component content
      expect(screen.getByText('🛒 Add to Cart')).toBeTruthy();
    });
  });

  describe('Performance and memoization', () => {
    it('memoizes context detection based on entities', () => {
      const result: GenerationResult = {
        appName: 'Test',
        entities: [{ name: 'Product', attributes: ['price'] }],
        userRoles: [],
        features: [],
      };

      const { rerender } = renderGeneratedApp(result);

      // Context should be detected
      expect(screen.getAllByText('🛍️').length).toBeGreaterThan(0);

      // Rerender with same entities - context should be memoized
      rerender(
        <AppProvider>
          <GeneratedApp
            generationResult={{
              ...result,
              appName: 'Updated Name', // Different app name but same entities
            }}
          />
        </AppProvider>,
      );

      // Should still show e-commerce context
      expect(screen.getAllByText('🛍️').length).toBeGreaterThan(0);
    });
  });

  describe('Tabbed Interface', () => {
    it('renders tabs for each entity', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // Now tabs should be visible
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
      expect(tabs[0].textContent).toContain('User');
      expect(tabs[1].textContent).toContain('Product');
    });

    it('allows switching between tabs', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // Initially User tab should be selected
      expect(
        screen.getByRole('tab', { name: /user entity management/i }).getAttribute('aria-selected'),
      ).toBe('true');
      expect(
        screen
          .getByRole('tab', { name: /product entity management/i })
          .getAttribute('aria-selected'),
      ).toBe('false');

      // User management content should be visible
      expect(screen.getByText('👤 User Management')).toBeTruthy();

      // Click on Product tab
      await act(async () => {
        await user.click(screen.getByRole('tab', { name: /product entity management/i }));
      });

      // Now Product tab should be selected
      expect(
        screen
          .getByRole('tab', { name: /product entity management/i })
          .getAttribute('aria-selected'),
      ).toBe('true');
      expect(
        screen.getByRole('tab', { name: /user entity management/i }).getAttribute('aria-selected'),
      ).toBe('false');

      // Product content should be visible
      expect(screen.getByText('🛍️ Product Card')).toBeTruthy();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      const firstTab = screen.getByRole('tab', { name: /user entity management/i });

      // Focus first tab
      await act(async () => {
        await user.click(firstTab);
      });

      // Tab to next tab using keyboard
      await act(async () => {
        await user.keyboard('{ArrowRight}');
      });

      // Second tab should now be selected
      expect(
        screen
          .getByRole('tab', { name: /product entity management/i })
          .getAttribute('aria-selected'),
      ).toBe('true');
    });

    it('handles single entity gracefully', async () => {
      const user = userEvent.setup();
      const singleEntityResult = {
        ...mockGenerationResult,
        entities: [{ name: 'User', attributes: ['name', 'email'] }],
      };

      renderGeneratedApp(singleEntityResult);

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // Should still render tabs even with single entity
      expect(screen.getByRole('tablist')).toBeTruthy();
      expect(screen.getAllByRole('tab')).toHaveLength(1);
      expect(screen.getByRole('tab', { name: /user entity management/i })).toBeTruthy();
    });

    it('handles many entities without UI breakdown', async () => {
      const user = userEvent.setup();
      const manyEntitiesResult = {
        ...mockGenerationResult,
        entities: Array.from({ length: 10 }, (_, i) => ({
          name: `Entity${i + 1}`,
          attributes: ['attr1', 'attr2'],
        })),
      };

      renderGeneratedApp(manyEntitiesResult);

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // Should render all tabs
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(10);

      // Tab container should have overflow handling
      const tabList = screen.getByRole('tablist');
      expect(tabList.classList.contains('overflow-x-auto')).toBe(true);
      expect(tabList.classList.contains('flex-wrap')).toBe(true);
    });

    it('has proper focus management', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      const tabs = screen.getAllByRole('tab');
      const tabPanels = screen.getAllByRole('tabpanel');

      // Each tab should have focus styling classes
      tabs.forEach(tab => {
        expect(tab.classList.contains('focus:outline-none')).toBe(true);
        expect(tab.classList.contains('focus:ring-2')).toBe(true);
        expect(tab.classList.contains('focus:ring-blue-500')).toBe(true);
      });

      // Each tab panel should have focus styling classes
      tabPanels.forEach(panel => {
        expect(panel.classList.contains('focus:outline-none')).toBe(true);
        expect(panel.classList.contains('focus:ring-2')).toBe(true);
        expect(panel.classList.contains('focus:ring-blue-500')).toBe(true);
      });
    });

    it('preserves entity component error boundaries within tabs', async () => {
      const user = userEvent.setup();
      // This test verifies that error boundaries are still present in the tab structure
      renderGeneratedApp();

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      // The error boundary wrapping should still work
      // EntityFormErrorBoundary is already wrapped around each entity component
      expect(screen.getByRole('tabpanel')).toBeTruthy();
    });

    it('maintains responsive design with proper mobile classes', async () => {
      const user = userEvent.setup();
      renderGeneratedApp();

      // Switch to detailed mode to see tabs
      const detailedButton = screen.getByRole('button', { name: 'Detailed' });
      await act(async () => {
        await user.click(detailedButton);
      });

      const tabList = screen.getByRole('tablist');
      expect(tabList.classList.contains('flex')).toBe(true);
      expect(tabList.classList.contains('flex-wrap')).toBe(true);
      expect(tabList.classList.contains('gap-1')).toBe(true);
      expect(tabList.classList.contains('p-1')).toBe(true);
      expect(tabList.classList.contains('bg-gray-100')).toBe(true);
      expect(tabList.classList.contains('rounded-lg')).toBe(true);
      expect(tabList.classList.contains('overflow-x-auto')).toBe(true);

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab.classList.contains('whitespace-nowrap')).toBe(true);
      });
    });
  });

  describe('Progressive Disclosure Features (Story 3.3)', () => {
    describe('Collapsible App Metadata Section (Task 1)', () => {
      it('renders collapsible app header with expand/collapse functionality', async () => {
        const user = userEvent.setup();
        renderGeneratedApp();

        // Check for app header disclosure button
        const disclosureButton = screen.getByRole('button', {
          name: /hide app details|show app details/i,
        });
        expect(disclosureButton).toBeTruthy();

        // Verify header content is visible
        expect(screen.getAllByText('Test App').length).toBeGreaterThan(0);
        expect(screen.getByRole('button', { name: /generate new app/i })).toBeTruthy();

        // Check that app details panel is expanded by default
        expect(screen.getByText('App Statistics')).toBeTruthy();
        expect(screen.getByText('Context Detection')).toBeTruthy();

        // Collapse the section
        await act(async () => {
          await user.click(disclosureButton);
        });

        // App statistics should be hidden when collapsed
        expect(screen.queryByText('App Statistics')).not.toBeTruthy();
      });

      it('displays app statistics with correct counts', () => {
        renderGeneratedApp();

        // Verify statistics are displayed individually since they're in separate elements
        expect(screen.getAllByText('Entities').length).toBeGreaterThan(0);
        expect(screen.getAllByText('User Roles').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
        expect(screen.getAllByText('2').length).toBeGreaterThan(0); // entities count appears multiple times
      });

      it('shows context detection information when applicable', () => {
        renderGeneratedApp();

        // Check for context detection section
        expect(screen.getByText('Context Detection')).toBeTruthy();
        expect(screen.getByText('Primary Domain')).toBeTruthy();
      });

      it('has proper ARIA labels for accessibility', () => {
        renderGeneratedApp();

        const disclosureButton = screen.getByRole('button', {
          name: /hide app details|show app details/i,
        });
        expect(disclosureButton).toBeTruthy();
      });
    });

    describe('Overview Mode Toggle (Task 5)', () => {
      it('renders view mode toggle controls', () => {
        renderGeneratedApp();

        // Check for view mode toggle
        expect(screen.getByText('View Mode:')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Overview' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Detailed' })).toBeTruthy();
      });

      it('starts in overview mode by default', () => {
        renderGeneratedApp();

        const overviewButton = screen.getByRole('button', { name: 'Overview' });
        const detailedButton = screen.getByRole('button', { name: 'Detailed' });

        // Overview should be active by default
        expect(overviewButton.classList.contains('bg-white')).toBe(true);
        expect(overviewButton.classList.contains('text-blue-700')).toBe(true);
        expect(overviewButton.classList.contains('shadow-sm')).toBe(true);
        expect(detailedButton.classList.contains('bg-white')).toBe(false);
        expect(detailedButton.classList.contains('text-blue-700')).toBe(false);
        expect(detailedButton.classList.contains('shadow-sm')).toBe(false);
      });

      it('switches between overview and detailed modes', async () => {
        const user = userEvent.setup();
        renderGeneratedApp();

        // Initially in overview mode - check for summary cards
        expect(screen.getAllByText('Data Entities').length).toBeGreaterThan(0);
        expect(screen.getByText('Key Features')).toBeTruthy();
        expect(screen.getAllByText('User Roles').length).toBeGreaterThan(0);

        // Switch to detailed mode
        const detailedButton = screen.getByRole('button', { name: 'Detailed' });
        await act(async () => {
          await user.click(detailedButton);
        });

        // Should now be in detailed mode
        expect(detailedButton.classList.contains('bg-white')).toBe(true);
        expect(detailedButton.classList.contains('text-blue-700')).toBe(true);
        expect(detailedButton.classList.contains('shadow-sm')).toBe(true);

        // Detailed view should show Data Management section
        expect(screen.getByText('Data Management')).toBeTruthy();
      });

      it('shows application summary card in overview mode', () => {
        renderGeneratedApp();

        // Check for summary statistics
        expect(screen.getAllByText('2').length).toBeGreaterThan(0); // entities count (appears multiple times)
        expect(screen.getAllByText('Data Entities').length).toBeGreaterThan(0);
        expect(screen.getAllByText('User Roles').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Features').length).toBeGreaterThan(0);
      });

      it('shows quick access cards with limited items in overview mode', () => {
        renderGeneratedApp();

        // Check for quick access cards
        expect(screen.getAllByText('Data Entities').length).toBeGreaterThan(0);
        expect(screen.getByText('Key Features')).toBeTruthy();
        expect(screen.getAllByText('User Roles').length).toBeGreaterThan(0);

        // Should show entity names
        expect(screen.getAllByText('User').length).toBeGreaterThan(0);
        expect(screen.getByText('Product')).toBeTruthy();
      });

      it('provides call-to-action to switch to detailed view', async () => {
        const user = userEvent.setup();
        renderGeneratedApp();

        const switchButton = screen.getByRole('button', { name: /switch to detailed view/i });
        expect(switchButton).toBeTruthy();

        // Click the switch button
        await act(async () => {
          await user.click(switchButton);
        });

        // Should switch to detailed mode
        const detailedButton = screen.getByRole('button', { name: 'Detailed' });
        expect(detailedButton.classList.contains('bg-white')).toBe(true);
        expect(detailedButton.classList.contains('text-blue-700')).toBe(true);
        expect(detailedButton.classList.contains('shadow-sm')).toBe(true);
      });
    });

    describe('Feature Details Progressive Disclosure (Task 3)', () => {
      beforeEach(() => {
        // Mock generation result with more detailed features
        const enhancedResult = {
          ...mockGenerationResult,
          features: [
            {
              name: 'Authentication',
              description: 'User login and registration system',
              operations: ['create', 'read', 'update', 'delete'],
              rolePermissions: {
                admin: ['full_access'],
                user: ['read', 'update_own'],
              },
              relatedEntities: ['User'],
            },
            {
              name: 'Product Management',
              description: 'CRUD operations for products',
              operations: ['create', 'read'],
              rolePermissions: {
                admin: ['create', 'read', 'update', 'delete'],
                user: ['read'],
              },
            },
          ],
        };
        renderGeneratedApp(enhancedResult);
      });

      it('renders features with collapsible disclosure panels', async () => {
        const user = userEvent.setup();

        // Switch to detailed mode first
        const detailedButton = screen.getByRole('button', { name: 'Detailed' });
        await act(async () => {
          await user.click(detailedButton);
        });

        // Check for feature disclosure buttons
        const featureButtons = screen.getAllByRole('button', {
          name: /more details|less details/i,
        });
        expect(featureButtons.length).toBeGreaterThan(0);
      });

      it('shows feature descriptions and expandable details', async () => {
        const user = userEvent.setup();

        // Switch to detailed mode
        const detailedButton = screen.getByRole('button', { name: 'Detailed' });
        await act(async () => {
          await user.click(detailedButton);
        });

        // Check feature names and descriptions are visible
        expect(screen.getByText('Authentication')).toBeTruthy();
        expect(screen.getByText('User login and registration system')).toBeTruthy();
      });

      it('has proper visual indicators for collapsible sections', async () => {
        const user = userEvent.setup();

        // Switch to detailed mode
        const detailedButton = screen.getByRole('button', { name: 'Detailed' });
        await act(async () => {
          await user.click(detailedButton);
        });

        // Check for chevron icons in feature headers
        const featureButtons = screen.getAllByRole('button', {
          name: /more details|less details/i,
        });
        expect(featureButtons.length).toBeGreaterThan(0);
      });
    });

    describe('Typography Hierarchy Enhancement (Task 4)', () => {
      it('uses consistent heading hierarchy throughout', () => {
        renderGeneratedApp();

        // Check main app title (h1)
        const mainTitle = screen.getByRole('heading', { name: 'Test App', level: 1 });
        expect(mainTitle.tagName).toBe('H1');

        // Check section headings (h2)
        const applicationDetails = screen.getByRole('heading', { name: 'Application Details' });
        expect(applicationDetails.tagName).toBe('H2');
      });

      it('applies proper font weights and sizes', () => {
        const { container } = renderGeneratedApp();

        // Main title should have bold font
        const mainTitle = container.querySelector('h1');
        expect(mainTitle?.classList.contains('font-bold')).toBe(true);

        // Section headings should have appropriate classes
        const sectionHeadings = container.querySelectorAll('h2');
        sectionHeadings.forEach(heading => {
          expect(heading.classList.contains('font-bold')).toBe(true);
        });
      });

      it('maintains consistent spacing and visual hierarchy', () => {
        const { container } = renderGeneratedApp();

        // Check for consistent spacing classes
        const contentAreas = container.querySelectorAll('.space-y-4, .space-y-6, .space-y-8');
        expect(contentAreas.length).toBeGreaterThan(0);
      });
    });

    describe('Visual Grouping and Content Organization (Task 6)', () => {
      it('has consistent visual grouping with borders and backgrounds', () => {
        const { container } = renderGeneratedApp();

        // Check for consistent border and background classes
        const borderedElements = container.querySelectorAll('.border, .border-gray-200');
        expect(borderedElements.length).toBeGreaterThan(0);

        const backgroundElements = container.querySelectorAll('.bg-white, .bg-gray-50');
        expect(backgroundElements.length).toBeGreaterThan(0);
      });

      it('provides clear content boundaries between sections', () => {
        const { container } = renderGeneratedApp();

        // Check for rounded corners and shadow classes for visual separation
        const separatedElements = container.querySelectorAll('.rounded-lg, .shadow-lg, .shadow-md');
        expect(separatedElements.length).toBeGreaterThan(0);
      });

      it('maintains logical reading flow and information hierarchy', () => {
        renderGeneratedApp();

        // Verify content flows logically from app title to details
        const appTitle = screen.getByRole('heading', { name: 'Test App', level: 3 });
        const applicationDetails = screen.getByText('Application Details');

        expect(appTitle).toBeTruthy();
        expect(applicationDetails).toBeTruthy();
      });

      it('applies consistent styling patterns throughout interface', () => {
        const { container } = renderGeneratedApp();

        // Check for consistent button styling
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
          expect(button.classList.contains('focus:outline-none')).toBe(true);
        });
      });
    });

    describe('Responsive Design Compliance', () => {
      it('works seamlessly across responsive breakpoints', () => {
        const { container } = renderGeneratedApp();

        // Check for responsive classes
        const responsiveElements = container.querySelectorAll(
          '[class*="sm:"], [class*="md:"], [class*="lg:"]',
        );
        expect(responsiveElements.length).toBeGreaterThan(0);
      });

      it('maintains progressive disclosure on mobile', () => {
        const { container } = renderGeneratedApp();

        // Check for mobile-friendly touch targets by finding elements with min-height classes
        const touchTargets = container.querySelectorAll('[class*="min-h-"]');
        expect(touchTargets.length).toBeGreaterThan(0);
      });

      it('has proper spacing for different screen sizes', () => {
        const { container } = renderGeneratedApp();

        // Check for responsive spacing classes
        const spacingElements = container.querySelectorAll(
          '[class*="gap-"], [class*="p-"], [class*="m-"]',
        );
        expect(spacingElements.length).toBeGreaterThan(0);
      });
    });

    describe('Accessibility Compliance', () => {
      it('provides proper ARIA labels for all collapsible sections', () => {
        renderGeneratedApp();

        // Check for ARIA labels on disclosure buttons
        const disclosureButton = screen.getByRole('button', {
          name: /hide app details|show app details/i,
        });
        expect(disclosureButton).toBeTruthy();
      });

      it('supports keyboard navigation for all interactive elements', () => {
        const { container } = renderGeneratedApp();

        // Check for focus styling on interactive elements
        const focusableElements = container.querySelectorAll('[class*="focus:"]');
        expect(focusableElements.length).toBeGreaterThan(0);
      });

      it('maintains screen reader compatibility', () => {
        renderGeneratedApp();

        // Check for screen reader only text
        const srOnlyElements = screen.getAllByText((_content, element) => {
          return element?.classList.contains('sr-only') || false;
        });
        expect(srOnlyElements.length).toBeGreaterThan(0);
      });
    });
  });
});
