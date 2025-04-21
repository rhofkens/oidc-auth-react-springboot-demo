import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PrivateTile from '../../components/PrivateTile';
import { useAuth } from '../../hooks/useAuth';
import { fetchWithAuth } from '../../lib/fetchWithAuth'; // Revert to fetchWithAuth
import { AuthContextProps } from '../../context/AuthContext';
import { User } from 'oidc-client-ts'; // Keep if needed for user mock

// Mock the dependencies
vi.mock('../../hooks/useAuth');
vi.mock('../../lib/fetchWithAuth'); // Mock fetchWithAuth again

// Type assertion for mocked functions
const mockedUseAuth = vi.mocked(useAuth);
const mockedFetchWithAuth = vi.mocked(fetchWithAuth); // Mock fetchWithAuth

// Helper function to create a default mock AuthContext value
const createMockAuthContext = (
  overrides: Partial<AuthContextProps> = {}
): AuthContextProps => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  renewToken: vi.fn().mockResolvedValue(null),
  ...overrides,
});

describe('PrivateTile Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('displays the placeholder text when not authenticated', () => {
    // Arrange: Mock useAuth to return not authenticated
    mockedUseAuth.mockReturnValue(createMockAuthContext({ isAuthenticated: false }));

    // Act
    render(<PrivateTile />);

    // Assert
    expect(screen.getByText('Private Content')).toBeInTheDocument();
    expect(
      screen.getByText('No access to private endpoint. Please login to get access.')
    ).toBeInTheDocument();
    // Ensure fetch was NOT called
    expect(mockedFetchWithAuth).not.toHaveBeenCalled();
  });

  it('displays loading state when authenticated and fetching', () => {
    // Arrange: Mock useAuth as authenticated with a user object + token
    const mockAccessToken = 'loading-token';
    mockedUseAuth.mockReturnValue(
      createMockAuthContext({
        isAuthenticated: true,
        user: { access_token: mockAccessToken } as User, // Provide mock user
      })
    );
    // Mock fetchWithAuth to return a promise that never resolves (simulates loading)
    mockedFetchWithAuth.mockReturnValue(new Promise(() => {}));

    // Act
    render(<PrivateTile />);

    // Assert
    expect(screen.getByText('Private Content')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Verify fetchWithAuth was called since we are authenticated
    // Verify fetchWithAuth was called with the correct token
    expect(mockedFetchWithAuth).toHaveBeenCalledWith('/api/v1/private/info', mockAccessToken);
  });

  it('displays the fetched data when authenticated and fetch succeeds', async () => {
    // Arrange: Mock useAuth as authenticated with a user object + token
    const mockAccessToken = 'success-token';
    const mockEmail = 'test@example.com';
     mockedUseAuth.mockReturnValue(
      createMockAuthContext({
        isAuthenticated: true,
        user: { access_token: mockAccessToken } as User, // Provide mock user
      })
    );
   // Mock fetchWithAuth to return successful response
    const mockResponse = {
      ok: true, // fetchWithAuth checks this internally, but good practice for mock clarity
      json: async () => ({ email: mockEmail }),
    } as Response; // Type assertion
    mockedFetchWithAuth.mockResolvedValue(mockResponse);

    // Act
    render(<PrivateTile />);

    // Assert: Wait for the success message to appear due to async fetch
    await waitFor(() => {
      expect(
        screen.getByText(/Private endpoint returned personal data:/)
      ).toBeInTheDocument();
    });
    // Check for the specific email (within the strong tag)
    const emailElement = screen.getByText(mockEmail);
    expect(emailElement).toBeInTheDocument();
    expect(emailElement.tagName).toBe('STRONG');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText(/Could not load private data/)).not.toBeInTheDocument(); // Check generic error isn't shown
    // Verify fetchWithAuth was called with the correct token
    expect(mockedFetchWithAuth).toHaveBeenCalledWith('/api/v1/private/info', mockAccessToken);
  });

  it('displays error state when authenticated and fetch fails', async () => {
    // Arrange: Mock useAuth as authenticated with a user object + token
    const mockAccessToken = 'error-token';
    const errorMessage = 'Failed to fetch private data';
     mockedUseAuth.mockReturnValue(
      createMockAuthContext({
        isAuthenticated: true,
        user: { access_token: mockAccessToken } as User, // Provide mock user
      })
    );
   // Mock fetchWithAuth to throw an error
    mockedFetchWithAuth.mockRejectedValue(new Error(errorMessage));

    // Act
    render(<PrivateTile />);

    // Assert: Wait for the specific error message to appear
    await waitFor(() => {
      // The component renders the actual error message from the catch block
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Private endpoint returned personal data:/)
    ).not.toBeInTheDocument();
    // Verify fetchWithAuth was called with the correct token
    expect(mockedFetchWithAuth).toHaveBeenCalledWith('/api/v1/private/info', mockAccessToken);
  });
});
