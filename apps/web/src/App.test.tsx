import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import React from 'react';

const renderApp = () => {
  return render(
    <AppProvider>
      <App />
    </AppProvider>,
  );
};

describe('App', () => {
  it('renders the main heading', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /ai app builder/i })).toBeTruthy();
  });

  it('renders the description text', () => {
    renderApp();
    expect(screen.getByText(/describe your app idea and let ai generate/i)).toBeTruthy();
  });

  it('renders the generation form', () => {
    renderApp();
    expect(screen.getByLabelText(/describe your app idea/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /generate/i })).toBeTruthy();
  });

  it('has responsive design classes', () => {
    const { container } = renderApp();
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50');
  });
});
