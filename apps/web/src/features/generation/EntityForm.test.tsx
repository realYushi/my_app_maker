import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import EntityForm from './EntityForm';
import type { Entity } from '@mini-ai-app-builder/shared-types';

const mockEntity: Entity = {
  name: 'User',
  attributes: ['name', 'email', 'password', 'age', 'description'],
};

const mockEntityWithSpecialFields: Entity = {
  name: 'Product',
  attributes: ['title', 'category', 'status', 'url', 'notes', 'phoneNumber', 'createdDate'],
};

const renderEntityForm = (entity: Entity = mockEntity) => {
  return render(<EntityForm entity={entity} />);
};

describe('EntityForm', () => {
  it('renders entity name as heading', () => {
    renderEntityForm();
    expect(screen.getByRole('heading', { name: 'User' })).toBeInTheDocument();
  });

  it('displays correct field count badge', () => {
    renderEntityForm();
    expect(screen.getByText('5 total fields')).toBeInTheDocument();
  });

  it('renders entity in summary mode with progressive disclosure', () => {
    renderEntityForm();
    // Should have toggle button to show details
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
    // Should show entity name
    expect(screen.getByText('User')).toBeInTheDocument();
    // Should show field count
    expect(screen.getByText('5 total fields')).toBeInTheDocument();
  });

  it('uses appropriate input types based on attribute names in summary mode', () => {
    renderEntityForm(mockEntityWithSpecialFields);

    // In summary mode, only essential fields (title) should be visible
    const titleField = screen.getByPlaceholderText('Enter title');
    expect(titleField).toHaveAttribute('type', 'text');

    // Other fields should not be visible in summary mode
    expect(screen.queryByPlaceholderText('Enter url')).toBeNull();
    expect(screen.queryByPlaceholderText('Enter phoneNumber')).toBeNull();
    expect(screen.queryByPlaceholderText('Enter createdDate')).toBeNull();

    // Should show indicator for additional fields
    expect(screen.getByText(/additional fields available in detailed view/i)).toBeInTheDocument();
  });

  it('shows progressive disclosure functionality', () => {
    renderEntityForm();
    // Should show toggle button
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
    // Should show additional fields message since default entity has non-essential fields
    expect(screen.getByText(/additional fields available in detailed view/i)).toBeInTheDocument();
  });

  it('maintains backward compatibility with field types when switched to detailed mode', async () => {
    const user = userEvent.setup();
    renderEntityForm(mockEntityWithSpecialFields);

    // Switch to detailed mode
    const detailsButton = screen.getByRole('button', { name: /show details/i });
    await act(async () => {
      await user.click(detailsButton);
    });

    // Now we should see the detailed view with all field types
    await waitFor(() => {
      expect(screen.getByText('Essential Information')).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('Enter title')).toHaveAttribute('type', 'text');
  });

  it('renders quick save button in summary mode', () => {
    renderEntityForm();
    expect(screen.getByRole('button', { name: 'Quick Save User' })).toBeInTheDocument();
    // Cancel button is only visible in detailed mode
  });

  it('has all form fields disabled in preview mode', () => {
    renderEntityForm();
    // Only essential fields are visible in summary mode, but they should be disabled
    const nameField = screen.getByPlaceholderText('Enter name');
    expect(nameField).toBeDisabled();

    // Quick save button should also be disabled
    const saveButton = screen.getByRole('button', { name: 'Quick Save User' });
    expect(saveButton).toBeDisabled();
  });

  it('has all buttons disabled', () => {
    renderEntityForm();
    const saveButton = screen.getByRole('button', { name: 'Quick Save User' });

    expect(saveButton).toBeDisabled();
    // Cancel button is only visible in detailed mode
  });

  it('displays non-functional form disclaimer', () => {
    renderEntityForm();
    expect(
      screen.getByText(/this is a non-functional form for preview purposes only/i),
    ).toBeInTheDocument();
  });

  it('generates appropriate placeholders in summary mode', () => {
    renderEntityForm();
    // Only essential field placeholders should be visible in summary mode
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    // Other placeholders should not be visible in summary mode
    expect(screen.queryByPlaceholderText('Enter email')).toBeNull();
    expect(screen.queryByPlaceholderText('Enter password')).toBeNull();
    expect(screen.queryByPlaceholderText('Enter age')).toBeNull();
    expect(screen.queryByPlaceholderText('Enter description')).toBeNull();
  });

  it('handles entity with no attributes', () => {
    const emptyEntity: Entity = { name: 'Empty', attributes: [] };
    renderEntityForm(emptyEntity);

    expect(screen.getByRole('heading', { name: 'Empty' })).toBeInTheDocument();
    expect(screen.getByText('0 total fields')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quick Save Empty' })).toBeInTheDocument();
  });

  it('correctly identifies number field types', async () => {
    const entityWithNumbers: Entity = {
      name: 'Stats',
      attributes: ['name', 'count', 'number', 'ageValue'], // Added 'name' so it shows as essential
    };
    const user = userEvent.setup();
    renderEntityForm(entityWithNumbers);

    // Switch to detailed mode to see all fields
    const detailsButton = screen.getByRole('button', { name: /show details/i });
    await act(async () => {
      await user.click(detailsButton);
    });

    // Wait for the mode to switch, fields should now be accessible
    await waitFor(() => {
      // Additional fields section should be present and expanded by default
      expect(screen.getByText(/Additional Fields \(/)).toBeInTheDocument();
    });

    // Wait for fields to be rendered - they should be accessible immediately
    await waitFor(() => {
      expect(screen.getByLabelText('count')).toBeInTheDocument();
    });

    // Fields should be in the detailed (additional) fields section
    expect(screen.getByLabelText('count')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('number')).toHaveAttribute('type', 'number');
    expect(screen.getByLabelText('ageValue')).toHaveAttribute('type', 'number');
  });

  it('correctly identifies password fields', async () => {
    const entityWithPassword: Entity = {
      name: 'Auth',
      attributes: ['name', 'password', 'confirmPassword'], // Added 'name' so it shows as essential
    };
    const user = userEvent.setup();
    renderEntityForm(entityWithPassword);

    // Switch to detailed mode to see all fields
    const detailsButton = screen.getByRole('button', { name: /show details/i });
    await act(async () => {
      await user.click(detailsButton);
    });

    // Wait for the mode to switch, fields should now be accessible
    await waitFor(() => {
      // Additional fields section should be present and expanded by default
      expect(screen.getByText(/Additional Fields \(/)).toBeInTheDocument();
    });

    // Wait for fields to be rendered - they should be accessible immediately
    await waitFor(() => {
      expect(screen.getByLabelText('password')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('password')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('confirmPassword')).toHaveAttribute('type', 'password');
  });

  it('has responsive design classes', () => {
    const { container } = renderEntityForm();
    const formContainer = container.firstChild as HTMLElement;
    expect(formContainer).toHaveClass(
      'bg-white',
      'border',
      'border-gray-200',
      'rounded-lg',
      'overflow-hidden',
      'hover:shadow-md',
    );
  });

  it('renders form fields with proper accessibility in summary mode', () => {
    renderEntityForm();

    // In summary mode, only essential fields should be accessible
    const nameField = screen.getByPlaceholderText('Enter name');
    expect(nameField).toBeInTheDocument();

    // Should have proper ARIA and accessibility
    expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();
  });

  it('maintains proper form structure', () => {
    renderEntityForm();

    // Even if not explicitly a form element, it should contain form-like structure
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quick Save User' })).toBeInTheDocument();
  });

  describe('Progressive Entity Disclosure (Task 2)', () => {
    const entityWithManyFields: Entity = {
      name: 'ComplexUser',
      attributes: [
        'id',
        'name',
        'title', // essential fields (id, name, title)
        'email',
        'description',
        'age',
        'category',
        'status',
        'notes', // detailed fields
      ],
    };

    it('renders entity header with view mode toggle', () => {
      renderEntityForm(entityWithManyFields);

      // Check for enhanced header with icon and controls
      expect(screen.getByText('ComplexUser')).toBeInTheDocument();
      expect(screen.getByText('9 total fields')).toBeInTheDocument();

      // Check for view mode toggle button
      expect(
        screen.getByRole('button', { name: /show details|show summary/i }),
      ).toBeInTheDocument();
    });

    it('starts in summary view mode by default', () => {
      renderEntityForm(entityWithManyFields);

      // Should show "Show Details" button initially
      expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();

      // Should show quick save button in summary mode
      expect(screen.getByRole('button', { name: /quick save/i })).toBeInTheDocument();
    });

    it('categorizes fields into essential and detailed', () => {
      renderEntityForm(entityWithManyFields);

      // In summary mode, should show essential fields
      expect(screen.getByLabelText('id')).toBeInTheDocument();
      expect(screen.getByLabelText('name')).toBeInTheDocument();
      expect(screen.getByLabelText('title')).toBeInTheDocument();

      // Should not show all detailed fields in summary mode
      expect(screen.queryByLabelText('description')).not.toBeInTheDocument();
    });

    it('switches between summary and detailed view modes', async () => {
      const user = userEvent.setup();
      renderEntityForm(entityWithManyFields);

      // Initially in summary mode
      expect(screen.getByRole('button', { name: /show details/i })).toBeInTheDocument();

      // Switch to detailed view
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      await act(async () => {
        await user.click(toggleButton);
      });

      // Should now be in detailed mode
      expect(screen.getByRole('button', { name: /show summary/i })).toBeInTheDocument();

      // Should show essential fields section
      expect(screen.getByText('Essential Information')).toBeInTheDocument();

      // Wait for the mode to switch, additional fields should be expanded by default
      await waitFor(() => {
        expect(screen.getByText(/Additional Fields \(/)).toBeInTheDocument();
      });

      // Wait for detailed fields to be rendered
      await waitFor(() => {
        expect(screen.getByLabelText('description')).toBeInTheDocument();
      });

      // Now detailed fields should be visible
      expect(screen.getByLabelText('description')).toBeInTheDocument();
      expect(screen.getByLabelText('notes')).toBeInTheDocument();
    });

    it('displays additional fields count in summary mode', () => {
      renderEntityForm(entityWithManyFields);

      // Should show how many additional fields are available
      expect(screen.getByText(/additional fields available in detailed view/i)).toBeInTheDocument();
    });

    it('shows collapsible sections in detailed view', async () => {
      const user = userEvent.setup();
      renderEntityForm(entityWithManyFields);

      // Switch to detailed view
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      await act(async () => {
        await user.click(toggleButton);
      });

      // Should show essential and additional sections
      expect(screen.getByText('Essential Information')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /additional fields/i })).toBeInTheDocument();
    });

    it('has proper visual indicators for entity type', () => {
      renderEntityForm(entityWithManyFields);

      // Should show entity badge
      expect(screen.getByText('Entity')).toBeInTheDocument();

      // Should have proper styling classes for enhanced header
      const { container } = renderEntityForm(entityWithManyFields);
      const header = container.querySelector('.bg-gray-50');
      expect(header).toBeInTheDocument();
    });

    it('handles entities with no essential fields gracefully', () => {
      const entityWithoutEssentials: Entity = {
        name: 'SimpleEntity',
        attributes: ['description', 'notes', 'category'],
      };

      renderEntityForm(entityWithoutEssentials);

      // Should show message about no essential fields
      expect(screen.getByText(/no essential fields detected/i)).toBeInTheDocument();
    });

    it('maintains consistent styling in both view modes', async () => {
      const user = userEvent.setup();
      const { container } = renderEntityForm(entityWithManyFields);

      // Check summary mode styling
      expect(container.querySelector('.border-gray-200')).toBeInTheDocument();

      // Switch to detailed view
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      await act(async () => {
        await user.click(toggleButton);
      });

      // Should maintain consistent styling
      expect(container.querySelector('.border-gray-200')).toBeInTheDocument();
    });

    it('updates form footer message based on view mode', async () => {
      const user = userEvent.setup();
      renderEntityForm(entityWithManyFields);

      // Initial footer message for summary view
      expect(screen.getByText(/switch to detailed view for all fields/i)).toBeInTheDocument();

      // Switch to detailed view
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      await act(async () => {
        await user.click(toggleButton);
      });

      // Footer message should update for detailed view
      expect(
        screen.getByText(/switch to summary view for essential fields only/i),
      ).toBeInTheDocument();
    });

    it('expands additional fields section in detailed view', async () => {
      const user = userEvent.setup();
      renderEntityForm(entityWithManyFields);

      // Switch to detailed view
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      await act(async () => {
        await user.click(toggleButton);
      });

      // Check for additional fields disclosure
      const additionalFieldsButton = screen.getByRole('button', { name: /additional fields/i });
      expect(additionalFieldsButton).toBeInTheDocument();

      // Additional fields should be accessible after disclosure starts open or we click to expand
      await waitFor(() => {
        expect(screen.getByLabelText('description')).toBeInTheDocument();
      });
      expect(screen.getByLabelText('notes')).toBeInTheDocument();
    });

    it('uses appropriate field types in all view modes', async () => {
      const user = userEvent.setup();
      renderEntityForm(entityWithManyFields);

      // Check field types in summary view
      expect(screen.getByLabelText('id')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('name')).toHaveAttribute('type', 'text');

      // Switch to detailed view
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      await act(async () => {
        await user.click(toggleButton);
      });

      // Wait for detailed fields to be available
      await waitFor(() => {
        expect(screen.getByLabelText('email')).toBeInTheDocument();
      });

      // Check field types in detailed view
      expect(screen.getByLabelText('email')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('age')).toHaveAttribute('type', 'number');
    });

    it('provides proper accessibility labels for all disclosure controls', () => {
      renderEntityForm(entityWithManyFields);

      // View mode toggle should have accessible label
      const toggleButton = screen.getByRole('button', { name: /show details/i });
      expect(toggleButton).toBeInTheDocument();

      // Entity type should be clearly labeled
      expect(screen.getByText('Entity')).toBeInTheDocument();
    });
  });
});
