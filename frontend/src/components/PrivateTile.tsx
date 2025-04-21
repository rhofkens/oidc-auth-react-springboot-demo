/**
 * PrivateTile component for displaying private content.
 *
 * This component displays a placeholder message when the user is not authenticated.
 * When the user is authenticated, it fetches data from the private API endpoint
 * `/api/v1/private/info` using `fetchWithAuth` and displays the user's email
 * address or loading/error states.
 * It uses the shadcn/ui card component for consistent styling with other components.
 *
 * @returns A card component displaying either the private content placeholder,
 *          loading state, error state, or the fetched private data.
 */
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { useAuth } from '../hooks/useAuth';
import { fetchWithAuth } from '../lib/fetchWithAuth'; // Use fetchWithAuth directly

/**
 * Interface representing the expected response from the private info endpoint.
 */
interface PrivateInfoResponse {
  email: string;
}

/**
 * PrivateTile component that conditionally displays content based on authentication.
 *
 * If the user is not authenticated, it shows a static message indicating that
 * login is required.
 * If the user is authenticated, it attempts to fetch data from a private endpoint
 * using fetchWithAuth. It displays loading, error, or the successfully fetched
 * data (user's email). Uses the same card styling as other tile components
 * for consistency.
 *
 * @example
 * ```tsx
 * <PrivateTile />
 * ```
 */
const PrivateTile: React.FC = () => {
  // Get user object as well to access the token
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<PrivateInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Only fetch if authenticated (user object implies authentication)
    if (!user) {
      // Reset state if user logs out while component is mounted
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      setData(null); // Clear previous data

      try {
        // Log the user and token before making the call
        console.log('PrivateTile: Making fetchWithAuth call. User:', user);
        console.log('PrivateTile: Access Token:', user?.access_token);

        // Pass the access token to fetchWithAuth
        const response = await fetchWithAuth('/api/v1/private/info', user?.access_token);
        // fetchWithAuth now just adds the header, error handling remains here
        if (!response.ok) {
           // Log the response status on error
           console.error(`PrivateTile: fetchWithAuth failed with status ${response.status}`);
           // Basic error handling if fetch itself succeeds but status is not ok
          // TODO: Enhance with Problem JSON parsing if needed, similar to useFetch
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: PrivateInfoResponse = await response.json();
        setData(result);
      } catch (err) {
        // Handle errors from fetch or JSON parsing
        setError(err instanceof Error ? err.message : 'Could not load private data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // No cleanup needed for abort controller as fetch itself handles signals if passed in init
  }, [user]); // Re-run effect if user object changes (includes token changes)

  // Use user object for the check
  if (!user) {
    return (
      <Card className="h-full shadow-sm rounded-xl p-6">
        <CardHeader className="pb-4 px-8 pt-8">
          <CardTitle className="text-3xl font-bold">Private Content</CardTitle>
        </CardHeader>
        <CardContent className="pt-10 px-8 pb-16">
          <div className="py-8">
            <p className="text-2xl">No access to private endpoint. Please login to get access.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Authenticated user states
  return (
    <Card className="h-full shadow-sm rounded-xl p-6">
      <CardHeader className="pb-4 px-8 pt-8">
        <CardTitle className="text-3xl font-bold">Private Content</CardTitle>
      </CardHeader>
      <CardContent className="pt-10 px-8 pb-16">
        <div className="py-8">
          {loading && <p className="text-2xl">Loading...</p>}
          {/* Display specific error message from fetch attempt */}
          {error && <p className="text-2xl text-destructive">{error}</p>}
          {/* Display data only if not loading and no error occurred */}
          {data && !loading && !error && (
            <p className="text-2xl">
              Private endpoint returned personal data: <strong>{data.email}</strong>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivateTile;
