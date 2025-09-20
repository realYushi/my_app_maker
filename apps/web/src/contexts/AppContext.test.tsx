import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppProvider } from './AppContext';
import { useAppContext } from '../hooks/useAppContext';
import type { GenerationResult } from '@mini-ai-app-builder/shared-types';
import React from 'react';

// Test component that uses the context
const TestComponent = () => {
  const {
    status,
    userInput,
    generationResult,
    error,
    setUserInput,
    setLoading,
    setSuccess,
    setError,
    reset,
  } = useAppContext();

  const mockResult: GenerationResult = {
    appName: 'Test App',
    entities: [{ name: 'User', attributes: ['id', 'name'] }],
    userRoles: [{ name: 'Admin', description: 'Administrator role' }],
    features: [{ name: 'Login', description: 'User authentication' }],
  };

  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="userInput">{userInput}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="appName">{generationResult?.appName}</div>

      <button onClick={() => setUserInput('test input')}>Set Input</button>
      <button onClick={setLoading}>Set Loading</button>
      <button onClick={() => setSuccess(mockResult)}>Set Success</button>
      <button onClick={() => setError('test error')}>Set Error</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <AppProvider>
      <TestComponent />
    </AppProvider>,
  );
};

describe('AppContext', () => {
  it('provides initial state correctly', () => {
    renderWithProvider();

    expect(screen.getByTestId('status').textContent).toBe('idle');
    expect(screen.getByTestId('userInput').textContent).toBe('');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('appName').textContent).toBe('');
  });

  it('updates user input correctly', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Set Input'));

    expect(screen.getByTestId('userInput').textContent).toBe('test input');
    expect(screen.getByTestId('status').textContent).toBe('idle');
  });

  it('sets loading state correctly', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Set Loading'));

    expect(screen.getByTestId('status').textContent).toBe('loading');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('sets success state correctly', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Set Success'));

    expect(screen.getByTestId('status').textContent).toBe('success');
    expect(screen.getByTestId('appName').textContent).toBe('Test App');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('sets error state correctly', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Set Error'));

    expect(screen.getByTestId('status').textContent).toBe('error');
    expect(screen.getByTestId('error').textContent).toBe('test error');
    expect(screen.getByTestId('appName').textContent).toBe('');
  });

  it('resets state correctly', () => {
    renderWithProvider();

    // Set some state first
    fireEvent.click(screen.getByText('Set Input'));
    fireEvent.click(screen.getByText('Set Error'));

    // Then reset
    fireEvent.click(screen.getByText('Reset'));

    expect(screen.getByTestId('status').textContent).toBe('idle');
    expect(screen.getByTestId('userInput').textContent).toBe('');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('appName').textContent).toBe('');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAppContext must be used within an AppProvider');

    consoleSpy.mockRestore();
  });
});
