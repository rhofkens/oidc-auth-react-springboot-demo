/**
 * Header component for the application.
 *
 * Displays the current authentication status and provides a login button.
 * In guest mode, it shows "Welcome, Guest" text and a login button.
 *
 * @returns A header component with authentication status and login button
 */
import React from 'react';

/**
 * Header component properties
 * Currently empty as the component doesn't accept any props in this version
 */
/**
 * Header component that displays the current authentication status and login controls.
 *
 * In the current implementation, it shows a static "Welcome, Guest" message
 * and a login button. Future implementations will handle actual authentication.
 */
const Header: React.FC = () => {
  return (
    <header className="bg-white p-10 shadow-sm rounded-xl mb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-medium text-slate-700">OIDC Auth Demo</h2>
          <h1 className="text-4xl font-bold text-slate-900">Browsing as Guest</h1>
        </div>
        <div className="flex items-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg text-xl font-medium"
            disabled
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
