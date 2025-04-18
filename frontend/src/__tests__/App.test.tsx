import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the components used in App
vi.mock('../components/ErrorBanner', () => ({
  default: () => <div data-testid="error-banner-component">Error Banner Component</div>,
}));
vi.mock('../components/Header', () => ({
  default: () => <div data-testid="header-component">Header Component</div>,
}));

vi.mock('../components/TilesGrid', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tiles-grid-component">{children}</div>
  ),
}));

vi.mock('../components/PublicTile', () => ({
  default: () => <div data-testid="public-tile-component">Public Tile Component</div>,
}));

vi.mock('../components/PrivateTile', () => ({
  default: () => <div data-testid="private-tile-component">Private Tile Component</div>,
}));

describe('App', () => {
  it('renders all components correctly', () => {
    render(<App />);

    // Check that ErrorBanner component is rendered
    expect(screen.getByTestId('error-banner-component')).toBeInTheDocument();

    // Check that Header component is rendered
    expect(screen.getByTestId('header-component')).toBeInTheDocument();

    // Check that TilesGrid component is rendered
    expect(screen.getByTestId('tiles-grid-component')).toBeInTheDocument();

    // Check that PublicTile component is rendered
    expect(screen.getByTestId('public-tile-component')).toBeInTheDocument();

    // Check that PrivateTile component is rendered
    expect(screen.getByTestId('private-tile-component')).toBeInTheDocument();
  });
});
