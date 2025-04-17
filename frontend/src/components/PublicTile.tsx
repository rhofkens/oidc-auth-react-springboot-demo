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
  const { data, loading, error } = useFetch<HealthResponse>('/api/v1/public/health');

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
        
        {error && (
          <div className="text-red-500 py-6 text-2xl">
            Error: {error}
          </div>
        )}
        
        {!loading && !error && data && (
          <div className="py-8">
            <p className="text-2xl font-medium">{data.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicTile;