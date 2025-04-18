import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import AuthCallback from '../../components/AuthCallback';
import authService from '../../services/authService';
import { useAuth } from '../../hooks/useAuth'; // Import from new location

// Mock dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../services/authService', () => ({
  default: {
    handleCallback: vi.fn(),
  },
}));

// Mock the useAuth hook from its new location
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AuthCallback Component', () => {
  let mockNavigate: ReturnType<typeof vi.fn>;
  let mockHandleCallback: ReturnType<typeof vi.fn>;
  let mockUseAuth: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate = vi.fn();
    mockHandleCallback = vi.fn();
    mockUseAuth = vi.fn();

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (authService.handleCallback as ReturnType<typeof vi.fn>).mockImplementation(mockHandleCallback);
    (useAuth as ReturnType<typeof vi.fn>).mockImplementation(mockUseAuth);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should process callback successfully and navigate home', async () => {
    mockUseAuth.mockReturnValue({ isLoading: false, user: null });
    mockHandleCallback.mockResolvedValue({ name: 'Test User' }); // Simulate successful login

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Check for loading indicator
    expect(screen.getByText('Processing login callback...')).toBeInTheDocument();

    // Wait for async operations in useEffect to complete
    await waitFor(() => {
      expect(mockHandleCallback).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  test('should handle callback error and navigate home', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
    mockUseAuth.mockReturnValue({ isLoading: false, user: null });
    const error = new Error('Callback processing failed');
    mockHandleCallback.mockRejectedValue(error); // Simulate error during callback

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Check for loading indicator
    expect(screen.getByText('Processing login callback...')).toBeInTheDocument();

    // Wait for async operations in useEffect to complete
    await waitFor(() => {
      expect(mockHandleCallback).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('AuthCallback: Error processing callback:', error);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true }); // Navigates home even on error
    });
    consoleErrorSpy.mockRestore();
  });

   test('should navigate home immediately if already logged in', async () => {
    mockUseAuth.mockReturnValue({ isLoading: false, user: { name: 'Existing User' } }); // Simulate already logged in

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Check for loading indicator
    expect(screen.getByText('Processing login callback...')).toBeInTheDocument();

    // handleCallback should not be called
    expect(mockHandleCallback).not.toHaveBeenCalled();

    // Should navigate immediately
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  test('should not process callback or navigate if auth state is loading', () => {
    mockUseAuth.mockReturnValue({ isLoading: true, user: null }); // Simulate loading state

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Check for loading indicator
    expect(screen.getByText('Processing login callback...')).toBeInTheDocument();

    // Neither callback nor navigation should happen while loading
    expect(mockHandleCallback).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

});