/**
 * PrivateTile component for displaying private content.
 *
 * This component displays a placeholder message when the user is not authenticated.
 * It uses the shadcn/ui card component for consistent styling with other components.
 *
 * @returns A card component displaying the private content placeholder
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

/**
 * PrivateTile component that displays a placeholder message for private content
 *
 * Shows a static message indicating that the user needs to login to access
 * private content. Uses the same card styling as other tile components for
 * consistency.
 *
 * @example
 * ```tsx
 * <PrivateTile />
 * ```
 */
const PrivateTile: React.FC = () => {
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
};

export default PrivateTile;
