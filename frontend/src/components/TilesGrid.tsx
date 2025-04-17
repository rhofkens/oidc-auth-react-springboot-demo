/**
 * TilesGrid component for the application.
 * 
 * Implements a responsive grid layout using Tailwind CSS that accepts child components
 * as props. This component is used to display the PublicTile and PrivateTile components
 * in a grid layout.
 * 
 * @returns A responsive grid layout containing the provided children
 */
import React, { ReactNode } from 'react';

/**
 * TilesGrid component properties
 */
interface TilesGridProps {
  /** Child components to be rendered within the grid */
  children: ReactNode;
  /** Optional additional CSS classes to apply to the grid container */
  className?: string;
}

/**
 * A responsive grid layout component that displays its children in a grid.
 * 
 * Uses Tailwind CSS for styling with appropriate spacing, padding, and responsive
 * behavior. On smaller screens, the grid will stack items vertically, while on
 * larger screens it will display them in a row.
 * 
 * @example
 * ```tsx
 * <TilesGrid>
 *   <PublicTile />
 *   <PrivateTile />
 * </TilesGrid>
 * ```
 */
const TilesGrid: React.FC<TilesGridProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
};

export default TilesGrid;