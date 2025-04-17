/**
 * Main App component for the OIDC Auth Demo application.
 * 
 * Implements the main layout of the application using the Header, TilesGrid,
 * PublicTile, and PrivateTile components. Uses Tailwind CSS for styling.
 * 
 * @returns The main application component
 */
import React from 'react';
import Header from './components/Header';
import TilesGrid from './components/TilesGrid';
import PublicTile from './components/PublicTile';
import PrivateTile from './components/PrivateTile';

/**
 * Main App component that serves as the entry point for the application.
 * 
 * Renders the Header component at the top, followed by a TilesGrid containing
 * the PublicTile and PrivateTile components.
 */
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <Header />
        <main className="py-16">
          <TilesGrid>
            <PublicTile />
            <PrivateTile />
          </TilesGrid>
        </main>
      </div>
    </div>
  );
};

export default App;
