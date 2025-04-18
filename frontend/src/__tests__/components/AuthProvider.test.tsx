import { render, screen, waitFor, act } from '@testing-library/react'; // Import act
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

import { AuthProvider } from 'components/AuthProvider'; // Use path relative to src
import { useAuth } from 'hooks/useAuth'; // Import hook from its new location
import authService from 'services/authService'; // Use default import
import { User } from 'oidc-client-ts';

// Mock UserManager events
const mockUserManagerEvents = {
  addUserLoaded: vi.fn(),
  addUserUnloaded: vi.fn(),
  addSilentRenewError: vi.fn(),
  addUserSignedOut: vi.fn(),
  removeUserLoaded: vi.fn(),
  removeUserUnloaded: vi.fn(),
  removeSilentRenewError: vi.fn(),
  removeUserSignedOut: vi.fn(),
};

// Mock the authService with its default export structure
vi.mock('services/authService', () => ({
  default: {
    getUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    renewToken: vi.fn(), // Add renewToken mock
    getUserManager: vi.fn(() => ({ // Add getUserManager mock
      events: mockUserManagerEvents, // Return mock events object
    })),
  },
}));

// Mock user data for testing
const mockUser: User = {
  id_token: 'mock_id_token',
  access_token: 'mock_access_token',
  token_type: 'Bearer',
  scope: 'openid profile email',
  profile: {
    iss: 'mock_issuer',
    sub: 'mock_sub',
    aud: 'mock_aud',
    exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
    iat: Math.floor(Date.now() / 1000),
    name: 'Test User',
    email: 'test@example.com',
  },
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  state: null,
  session_state: 'mock_session_state',
  toStorageString: () => 'mock_storage_string',
  expires_in: 3600,
  expired: false,
  scopes: ['openid', 'profile', 'email'],
};

// A simple test component that uses the auth context
const TestConsumerComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Auth Status</h1>
      <p data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      {user && <p data-testid="user-name">{user.profile.name}</p>}
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should show loading state initially and then unauthenticated if no user', async () => {
    // Arrange: Mock getUser to return null
    vi.mocked(authService.getUser).mockResolvedValue(null); // vi.mocked works with default imports

    // Act
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Assert: Initial loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Eventually settles to unauthenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(vi.mocked(authService.getUser)).toHaveBeenCalledTimes(1); // Check mock call
  });

  it('should show authenticated state when user is fetched successfully', async () => {
    // Arrange: Mock getUser to return a mock user
    vi.mocked(authService.getUser).mockResolvedValue(mockUser); // Use vi.mocked

    // Act
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Assert: Initial loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Eventually settles to authenticated with user info
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(vi.mocked(authService.getUser)).toHaveBeenCalledTimes(1); // Check mock call
  });

  it('should call authService.login when login function is invoked', async () => {
    // Arrange
    vi.mocked(authService.getUser).mockResolvedValue(null); // Start unauthenticated
    vi.mocked(authService.login).mockResolvedValue(undefined); // Mock login function

    // Act
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    // Click login button within act
    await act(async () => {
      screen.getByRole('button', { name: /login/i }).click();
    });

    // Assert
    expect(vi.mocked(authService.login)).toHaveBeenCalledTimes(1); // Check mock call
  });


  it('should call authService.renewToken when renewToken function is invoked', async () => {
    // Arrange
    vi.mocked(authService.getUser).mockResolvedValue(mockUser); // Start authenticated
    vi.mocked(authService.renewToken).mockResolvedValue(mockUser); // Mock renewToken success

    let renewTokenFn: () => Promise<User | null>;

    const ConsumerWithRenew = () => {
      const auth = useAuth();
      renewTokenFn = auth.renewToken; // Capture the function
      return <TestConsumerComponent />; // Reuse existing consumer for rendering
    };

    // Act
    render(
      <AuthProvider>
        <ConsumerWithRenew />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Call renewToken within act
    let result: User | null = null;
    await act(async () => {
      result = await renewTokenFn();
    });

    // Assert
    expect(vi.mocked(authService.renewToken)).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
    // Check if user state is still correct after renew
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
  });

  it('should handle error during initial user loading', async () => {
    // Arrange: Mock getUser to reject
    const loadError = new Error('Failed to load user');
    vi.mocked(authService.getUser).mockRejectedValue(loadError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    // Act
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Assert: Initial loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Assert: Eventually settles to unauthenticated after error
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
    expect(vi.mocked(authService.getUser)).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('AuthProvider - Error loading user:', loadError);

    consoleErrorSpy.mockRestore(); // Clean up spy
  });

  it('should handle error during token renewal', async () => {
    // Arrange
    vi.mocked(authService.getUser).mockResolvedValue(mockUser); // Start authenticated
    const renewError = new Error('Failed to renew token');
    vi.mocked(authService.renewToken).mockRejectedValue(renewError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error

    let renewTokenFn: () => Promise<User | null>;

    const ConsumerWithRenew = () => {
      const auth = useAuth();
      renewTokenFn = auth.renewToken;
      return <TestConsumerComponent />;
    };

    // Act
    render(
      <AuthProvider>
        <ConsumerWithRenew />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Call renewToken within act
    let result: User | null = null;
    await act(async () => {
      result = await renewTokenFn();
    });

    // Assert
    expect(vi.mocked(authService.renewToken)).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
    // Check if user state becomes unauthenticated after failed renew
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(consoleErrorSpy).toHaveBeenCalledWith('AuthProvider - Error renewing token:', renewError);

    consoleErrorSpy.mockRestore(); // Clean up spy
  });

  it('should throw error if useAuth is used outside AuthProvider', () => {
    // Arrange: A component that calls useAuth directly
    const BadConsumer = () => {
      useAuth();
      return <div>Should not render</div>;
    };

    // Act & Assert: Expect render to throw
    // Suppress console.error output from React about the error boundary
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    consoleErrorSpy.mockRestore();
  });

  it('should call authService.logout when logout function is invoked', async () => {
    // Arrange
    vi.mocked(authService.getUser).mockResolvedValue(mockUser); // Start authenticated
    vi.mocked(authService.logout).mockResolvedValue(undefined); // Mock logout function

    // Act
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Click logout button within act
    await act(async () => {
      screen.getByRole('button', { name: /logout/i }).click();
    });

    // Assert
    expect(vi.mocked(authService.logout)).toHaveBeenCalledTimes(1); // Check mock call
  });

  // TODO: Add tests for error handling during getUser if applicable
});