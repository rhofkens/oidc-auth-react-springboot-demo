/**
 * ErrorDemo Component
 *
 * A simple component to demonstrate the ErrorBanner functionality
 * by allowing users to trigger and clear error messages.
 *
 * @module components/ErrorDemo
 */
import React from 'react';
import { useErrorStore } from '../store/errorStore';

/**
 * ErrorDemo component provides buttons to trigger and clear error messages
 *
 * @returns {JSX.Element} The rendered component
 */
export const ErrorDemo: React.FC = () => {
  const setError = useErrorStore((state) => state.setError);
  const clearError = useErrorStore((state) => state.clearError);

  const handleTriggerError = () => {
    setError(
      'This is a test error message. It will auto-dismiss in 5 seconds, or you can close it manually.'
    );
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Error Banner Demo</h2>
      <div className="flex gap-4">
        <button
          onClick={handleTriggerError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Trigger Error
        </button>
        <button
          onClick={clearError}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Clear Error
        </button>
      </div>
    </div>
  );
};

export default ErrorDemo;
