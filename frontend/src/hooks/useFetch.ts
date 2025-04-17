/**
 * A custom hook that wraps the fetch API with TypeScript generics and state management.
 * 
 * This hook provides:
 * - TypeScript generics for the response type
 * - Loading state management
 * - Success state with typed data
 * - Error state with error message
 * - Automatic error logging to console
 * 
 * @template T The expected type of the response data
 * @param url The URL to fetch from
 * @param options Optional fetch options (method, headers, etc.)
 * @returns An object containing loading state, data, and error information
 */
import { useState, useEffect } from 'react';

interface UseFetchState<T> {
  /** Indicates if the fetch request is in progress */
  loading: boolean;
  /** The data returned from the fetch request, typed as T */
  data: T | null;
  /** Error message if the fetch request failed */
  error: string | null;
}

interface FetchOptions extends RequestInit {
  /** Whether to skip the fetch request */
  skip?: boolean;
}

/**
 * A hook for making fetch requests with built-in loading, success, and error states.
 * 
 * @example
 * ```tsx
 * // Example usage with a HealthResponse type
 * interface HealthResponse {
 *   message: string;
 * }
 * 
 * function HealthComponent() {
 *   const { data, loading, error } = useFetch<HealthResponse>('/api/v1/public/health');
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   return <div>{data?.message}</div>;
 * }
 * ```
 */
export function useFetch<T>(url: string, options?: FetchOptions): UseFetchState<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    // Don't fetch if skip is true
    if (options?.skip) {
      setState((prevState) => ({ ...prevState, loading: false }));
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setState({ loading: true, data: null, error: null });

      try {
        const response = await fetch(url, {
          ...options,
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setState({ loading: false, data, error: null });
      } catch (error) {
        // Only update state if the request wasn't aborted
        if (!signal.aborted) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('Fetch error:', errorMessage);
          setState({ loading: false, data: null, error: errorMessage });
        }
      }
    };

    fetchData();

    // Cleanup function to abort fetch on unmount or url/options change
    return () => {
      controller.abort();
    };
  }, [url, JSON.stringify(options)]);

  return state;
}

export default useFetch;