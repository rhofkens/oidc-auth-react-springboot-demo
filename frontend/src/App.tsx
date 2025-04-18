/**
 * Main App component for the OIDC Auth Demo application.
 *
 * Sets up routing and renders the main layout or the auth callback component.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import router components
import Header from './components/Header';
import TilesGrid from './components/TilesGrid';
import PublicTile from './components/PublicTile';
import PrivateTile from './components/PrivateTile';
import ErrorBanner from './components/ErrorBanner';
import ErrorDemo from './components/ErrorDemo';
import AuthCallback from './components/AuthCallback'; // Import the callback component

/**
 * @component MainLayout
 * @description Renders the standard application layout with Header, Tiles, etc.
 */
const MainLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-100 py-16">
    <ErrorBanner />
    <div className="max-w-6xl mx-auto px-6">
      <Header />
      <main className="py-16">
        <TilesGrid>
          <PublicTile />
          <PrivateTile />
        </TilesGrid>
        <ErrorDemo />
      </main>
    </div>
  </div>
);

/**
 * Main App component that sets up routing.
 *
 * Renders the MainLayout for the root path and the AuthCallback component
 * for the /auth/callback path.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the main application layout */}
        <Route path="/" element={<MainLayout />} />

        {/* Route for handling the OIDC callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* You could add other routes here, e.g., a specific error page */}
        {/* <Route path="/error" element={<ErrorPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
