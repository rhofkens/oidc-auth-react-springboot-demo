/**
 * A custom hook that wraps the fetch API with TypeScript generics and state management.
 *
 * This hook provides:
 * - TypeScript generics for the response type
 * - Loading state management
 * - Success state with typed data
 * - Error state with error message
 * - Automatic error logging to console
 * - Problem JSON parsing for error responses
 * - Integration with global error store
 *
 * @template T The expected type of the response data
 * @param url The URL to fetch from
 * @param options Optional fetch options (method, headers, cacheKey, etc.)
 * @returns An object containing loading state, data, error information, and staleness flag
 */
import { useState, useEffect } from 'react';
import { useErrorStore } from '../store/errorStore';

/**
 * Problem JSON interface following RFC 7807 standard
 * Used for parsing error responses from the backend
 */
interface ProblemJson {
  /** URI reference that identifies the problem type */
  type?: string;
  /** Short, human-readable summary of the problem */
  title?: string;
  /** HTTP status code */
  status?: number;
  /** Human-readable explanation specific to this occurrence of the problem */
  detail?: string;
  /** Timestamp when the error occurred */
  timestamp?: string;
}

interface UseFetchState<T> {
  /** Indicates if the fetch request is in progress */
  loading: boolean;
  /** The data returned from the fetch request, typed as T */
  data: T | null;
  /** Error message if the fetch request failed */
  error: string | null;
  /** Indicates if the returned data is from cache due to a fetch error */
  isStale?: boolean;
}

interface FetchOptions extends RequestInit {
  /** Whether to skip the fetch request */
  skip?: boolean;
  /** Whether to update the global error store on error. Defaults to true. */
  updateErrorStore?: boolean;
  /**
   * Optional key to cache the response in sessionStorage.
   * If provided, successful responses are cached.
   * On fetch errors, the hook attempts to return cached data with `isStale: true`.
   */
  cacheKey?: string;
}

/**
 * A hook for making fetch requests with built-in loading, success, and error states.
 * Also handles Problem JSON error responses and integrates with the global error store.
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
  const { cacheKey, skip, updateErrorStore = true, ...fetchOptions } = options || {};

  const [state, setState] = useState<UseFetchState<T>>(() => {
    let initialData: T | null = null;
    // Try to load initial data from cache if cacheKey is provided and not skipping
    if (cacheKey && !skip) {
      try {
        const cachedItem = sessionStorage.getItem(cacheKey);
        if (cachedItem) {
          initialData = JSON.parse(cachedItem);
        }
      } catch (error) {
        console.error(`Error reading cache key "${cacheKey}" from sessionStorage:`, error);
        sessionStorage.removeItem(cacheKey); // Clear potentially corrupted cache item
      }
    }
    return {
      loading: !skip && !initialData, // Only loading if not skipping and no initial cache hit
      data: initialData,
      error: null,
      isStale: false, // Initial data from cache (if any) is considered fresh until fetch attempt
    };
  });

  // Get the setError function from the error store (Revert back)
  const setError = useErrorStore((state) => state.setError);
  const clearError = useErrorStore((state) => state.clearError);

  useEffect(() => {
    // Use setError/clearError directly (Revert back)
    // Don't fetch if skip is true
    if (skip) {
      // If skipped, ensure loading is false, but keep potential initial cache data
      setState((prevState) => ({ ...prevState, loading: false, isStale: false }));
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    /**
     * Parses a Problem JSON response and returns a user-friendly error message
     * @param response The fetch Response object
     * @returns A promise that resolves to a user-friendly error message
     */
    const parseProblemJson = async (response: Response): Promise<string> => {
      try {
        // Try to parse the response as Problem JSON
        const problem: ProblemJson = await response.json();

        // For 500 errors, use a generic message
        if (response.status >= 500) {
          return 'Service unavailable—please retry';
        }

        // If we have a detail message in the Problem JSON, use it
        if (problem.detail) {
          return problem.detail;
        }

        // If we have a title in the Problem JSON, use it
        if (problem.title) {
          return problem.title;
        }

        // Fallback to a generic error message with status code
        return `Error: ${response.status} ${response.statusText}`;
      } catch {
        // If we can't parse the response as JSON, return a generic error message
        if (response.status >= 500) {
          return 'Service unavailable—please retry';
        }
        return `Error: ${response.status} ${response.statusText}`;
      }
    };

    const fetchData = async () => {
      // Set loading state, keeping existing data if available (for cache scenarios)
      setState((prevState) => ({ ...prevState, loading: true, error: null, isStale: false }));

      // Clear any existing error in the store when starting a new fetch
      if (updateErrorStore && clearError) {
        clearError();
      }

      try {
        const response = await fetch(url, {
          ...fetchOptions, // Use destructured options without cacheKey/skip/updateErrorStore
          signal,
        });

        if (!response.ok) {
          // Get a user-friendly error message from the Problem JSON
          const errorMessage = await parseProblemJson(response);
          throw new Error(errorMessage); // Throw to be caught by the catch block
        }

        // Attempt to parse JSON, handle potential parsing errors
        let data: T;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Fetch error: Failed to parse JSON response.', jsonError);
          throw new Error('Received invalid data format from server.');
        }

        // Cache the successful response if cacheKey is provided
        if (cacheKey) {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          } catch (cacheError) {
            console.error(`Error writing cache key "${cacheKey}" to sessionStorage:`, cacheError);
            // Decide if we should clear the item if quota is exceeded, etc. For now, just log.
          }
        }

        // Set final success state
        setState({ loading: false, data, error: null, isStale: false });
      } catch (error) {
        // Only process error if the request wasn't aborted
        if (!signal.aborted) {
          let errorMessage: string;

          // Determine the error message
          if (error instanceof TypeError && error.message.includes('fetch')) {
            errorMessage = 'Cannot connect to server—please check your connection';
          } else {
            errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          }

          console.error('Fetch error:', errorMessage);

          // --- Caching Fallback Logic ---
          let cachedData: T | null = null;
          let servedFromCache = false;
          if (cacheKey) {
            try {
              const cachedItem = sessionStorage.getItem(cacheKey);
              if (cachedItem) {
                cachedData = JSON.parse(cachedItem);
                servedFromCache = true;
              }
            } catch (cacheError) {
              console.error(
                `Error reading cache key "${cacheKey}" during error fallback:`,
                cacheError
              );
              sessionStorage.removeItem(cacheKey); // Clear potentially corrupted item
            }
          }

          if (servedFromCache && cachedData !== null) {
            // Serve stale data from cache
            setState({ loading: false, data: cachedData, error: null, isStale: true });
            // Do NOT update the global error store when serving stale cache
            if (updateErrorStore && clearError) {
              clearError(); // Ensure any previous error is cleared
            }
          } else {
            // No cache available or no cacheKey provided, set error state
            setState({ loading: false, data: null, error: errorMessage, isStale: false });
            // Update the global error store if enabled
            if (updateErrorStore && setError) {
              setError(errorMessage);
            }
          }
          // --- End Caching Fallback Logic ---
        }
      }
    };

    fetchData();

    // Cleanup function to abort fetch on unmount or url/options change
    return () => {
      controller.abort();
    };
    // Include setError/clearError in dependency array (Revert back)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(fetchOptions), cacheKey, skip, updateErrorStore, setError, clearError]);

  return state;
}

export default useFetch;
