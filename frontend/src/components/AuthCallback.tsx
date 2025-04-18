import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../hooks/useAuth'; // Import useAuth from its new location

/**
 * @component AuthCallback
 * @description Handles the OIDC redirect callback. Processes the response from the
 * identity provider using AuthService and redirects the user to the home page.
 * Displays loading/error states during the process.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, user } = useAuth(); // Access auth state if needed later

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('AuthCallback: Processing callback...');
        const loggedInUser = await authService.handleCallback();
        console.log('AuthCallback: Callback processed, user:', loggedInUser);
        // Redirect to home page after successful login
        // The AuthProvider's event listener should handle setting the user state
        navigate('/', { replace: true });
      } catch (error) {
        console.error('AuthCallback: Error processing callback:', error);
        // Optionally display an error message to the user
        // Redirect to an error page or home page on failure
        navigate('/', { replace: true }); // Redirect home even on error for now
      }
    };

    // Only process callback if not already authenticated and not loading
    // This prevents reprocessing if the component re-renders after successful login
    if (!isLoading && !user) {
       processCallback();
    } else if (!isLoading && user) {
        // Already logged in, just redirect home
        console.log('AuthCallback: Already logged in, redirecting home.');
        navigate('/', { replace: true });
    }

    // Dependency array includes isLoading and user to re-evaluate if auth state changes externally
  }, [navigate, isLoading, user]);

  // Display a loading indicator while processing
  return <div>Processing login callback...</div>;
};

export default AuthCallback;