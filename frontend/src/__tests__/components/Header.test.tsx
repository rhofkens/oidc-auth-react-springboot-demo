import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Header from '../../components/Header'; // Adjust path if necessary
import { useAuth } from '../../hooks/useAuth'; // Adjust path to new hook location
import { User } from 'oidc-client-ts';
import { MockedFunction } from 'vitest'; // Import Vitest's MockedFunction

// Mock the useAuth hook
// Cast useAuth to MockedFunction for type safety with mockReturnValue
const mockedUseAuth = useAuth as MockedFunction<typeof useAuth>;
// Mock the useAuth hook from its new location
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Define mock functions for login and logout
const mockLogin = vi.fn();
const mockLogout = vi.fn();

describe('Header Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Reset the implementation of the mock if needed, or set default
    mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        login: mockLogin,
        logout: mockLogout,
        isLoading: false,
        renewToken: vi.fn(),
      });
  });

  test('renders correctly when unauthenticated', () => {
    // Arrange: Mock is already set to unauthenticated in beforeEach
    render(<Header />);

    // Assert: Check for guest text and Login button
    expect(screen.getByText(/Browsing as Guest/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Logout/i })).not.toBeInTheDocument();
  });

  test('calls login function when Login button is clicked', () => {
    // Arrange: Mock is already set to unauthenticated
    render(<Header />);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Act: Simulate click
    fireEvent.click(loginButton);

    // Assert: Check if login mock was called
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  test('renders correctly when authenticated', () => {
    // Arrange: Set mock to authenticated state
    const mockUser: Partial<User> = { // Using Partial<User> for easier mocking
      profile: {
        name: 'Test User',
        // Add other required profile properties if needed, e.g., sub
        sub: 'test-sub',
        iss: 'test-iss',
        aud: 'test-aud',
        exp: Date.now() / 1000 + 3600, // Expires in 1 hour
        iat: Date.now() / 1000,
      },
      expired: false,
    };
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser as User, // Cast to User
      login: mockLogin,
      logout: mockLogout,
      isLoading: false,
      renewToken: vi.fn(),
    });

    render(<Header />);

    // Assert: Check for user text and Logout button
    expect(screen.getByText(/Signed in as Test User/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Login/i })).not.toBeInTheDocument();
  });

  test('calls logout function when Logout button is clicked', () => {
    // Arrange: Set mock to authenticated state
     const mockUser: Partial<User> = {
      profile: { name: 'Test User', sub: 'test-sub', iss: 'test-iss', aud: 'test-aud', exp: Date.now() / 1000 + 3600, iat: Date.now() / 1000 },
      expired: false,
    };
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser as User,
      login: mockLogin,
      logout: mockLogout,
      isLoading: false,
      renewToken: vi.fn(),
    });

    render(<Header />);
    const logoutButton = screen.getByRole('button', { name: /Logout/i });

    // Act: Simulate click
    fireEvent.click(logoutButton);

    // Assert: Check if logout mock was called
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
