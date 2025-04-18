/**
 * PublicTile component for displaying public health information.
 *
 * This component fetches health status from the public API endpoint and displays
 * the result in a card. It handles loading states, errors, and successful responses.
 *
 * @returns A card component displaying the public health status
 */
import React from 'react';
import useFetch from '../hooks/useFetch';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from 'ui/badge'; // Import Badge component using the correct alias

/**
 * Interface for the health response from the API
 */
interface HealthResponse {
  message: string;
}

/**
 * PublicTile component that displays the health status from the public API
 *
 * Uses the useFetch hook to call the public health endpoint and displays
 * the response in a styled card. Shows loading state and error handling.
 *
 * @example
 * ```tsx
 * <PublicTile />
 * ```
 */
const PublicTile: React.FC = () => {
  // Fetch health status, using caching and tracking staleness
  const { data, loading, isStale } = useFetch<HealthResponse>('/api/v1/public/health', {
    updateErrorStore: true,
    cacheKey: 'health-cache', // Enable caching for this endpoint
  });

  return (
    <Card className="h-full shadow-sm rounded-xl p-6">
      <CardHeader className="pb-4 px-8 pt-8">
        <CardTitle className="text-3xl font-bold">Public Health Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-10 px-8 pb-16">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && data && (
          <div className="py-8 relative">
            {' '}
            {/* Added relative positioning for badge */}
            <p className="text-2xl font-medium">{data.message}</p>
            {/* Display a badge if the data is stale (served from cache) */}
            {isStale && (
              <Badge
                variant="outline" // Using outline variant as 'stale' might not exist yet
                className="absolute top-0 right-0 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full" // Explicit styling for stale look
              >
                stale data
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicTile;
