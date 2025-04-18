/**
 * Header component for the application.
 *
 * Displays the current authentication status (Guest or Signed In user)
 * and provides Login/Logout buttons using the useAuth hook.
 *
 * @returns A header component with dynamic authentication status and controls.
 */
import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook from its new location
import { Button } from './ui/button'; // Import the Button component

/**
 * Header component that displays the current authentication status and login controls.
 *
 * Uses the useAuth hook to determine if the user is authenticated and displays
 * the appropriate status message and action button (Login or Logout).
 */
const Header: React.FC = () => {
  // Get authentication state and functions from the context
  const { isAuthenticated, user, login, logout, isLoading } = useAuth();

  // Determine the user's display name, fallback to 'User' if not available
  const userName = user?.profile?.name || 'User';

  return (
    <header className="bg-white p-10 shadow-sm rounded-xl mb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-slate-700">OIDC Auth Demo</h2>
          {/* Display user status based on authentication state */}
          <h1 className="text-4xl font-bold text-slate-900">
            {isLoading
              ? 'Loading...'
              : isAuthenticated
                ? `Signed in as ${userName}`
                : 'Browsing as Guest'}
          </h1>
        </div>
        <div className="flex items-center">
          {/* Display Login or Logout button based on authentication state */}
          {isLoading ? (
            <Button
              className="px-10 py-3 rounded-lg text-xl font-medium"
              disabled // Disable button while loading
            >
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <Button
              onClick={() => logout()} // Call logout function on click
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-lg text-xl font-medium"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => login()} // Call login function on click
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg text-xl font-medium"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
